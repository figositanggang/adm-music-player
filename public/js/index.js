window.scroll({
    behavior: "smooth"
})

const
audio = document.querySelector("audio"),
progressAudio = document.getElementById("progress-audio"),
inputVolume = document.getElementById("input-volume");

const
play_pause = document.querySelectorAll("#play-pause"),
muteAudio = document.getElementById("mute-audio"),
previousSong = document.getElementById("previous-song"),
nextSong = document.getElementById("next-song"),
repeatAudio = document.getElementById("repeat-audio"),
shuffleAudioEl = document.querySelector("section#player div#bawah #shuffle-audio");

const
bukaPlayer = document.querySelector("div#playing div#kiri"),
sectionPlayer = document.querySelector("section#player"),
closePlayer = document.getElementById("close-player");

const
audioCurrentDuration = document.querySelector("section#player div#bawah div .currentDuration"),
audioDuration = document.querySelector("section#player div#bawah div .duration");

const
playingContainer = document.querySelector("div#playing"),
albumCover = document.querySelectorAll("#album-cover-playing"),
albumCoverPlaying = document.querySelector("div#playing div#kiri #album-cover-playing");

const clickEffect = document.getElementById("click-aw");

const
hoverBox = document.getElementById("hover-box"),
hoverElement = document.querySelectorAll("[data-hover]");

const
bukaUser = document.querySelector("header #profile"),
tutupUser = document.getElementById("tutup-user"),
sectionUser = document.querySelector("section#user");

const
titleSong = document.querySelectorAll("#title-playing"),
artist = document.querySelectorAll("#artist-playing");

const
albumCoverBaruDidengar = document.querySelector("div#baru-didengar #parent #album-cover"),
baruDidengarContainer = document.querySelector("div#baru-didengar #parent");

const
listLaguHomeContainer = document.getElementById("list-lagu-home-container");


const dataSong = fetch("../json/songs.json")
    .then(response => response.json())
    .then(data => {
        let idx = 0;
        let isShuffle = false;

        data.forEach(song => {
            listLaguHomeContainer.innerHTML += isiListLaguHomeContainer(song)
        })

        // link
        if (idx < 0) idx = data.length-1;
        else if (idx > data.length-1) idx = 0;
        audio.src = data[idx].link

        // title - artist
        titleSong.forEach(title => title.innerText = data[idx].title);
        artist.forEach(artist => artist.innerText = data[idx].artist)

        const
        songClickPlay = document.querySelectorAll("[data-id]");
        songClickPlay.forEach(el => {
            el.onclick = () => {
                console.log('aw');
                let id = el.dataset.id;
                audio.classList.add("aw")
                idx = id-1;
                playNewAudio(data, idx)
            }
        })

        // album cover
        albumCover.forEach(albumCover => albumCover.style.backgroundImage = `url('${data[idx].cover}')`)

        // volume
        inputVolume.value = .5
        audio.volume = inputVolume.value

        isiBaruDidengar(data, idx)

        // Play Pause
        play_pause.forEach(button => {
            button.innerHTML = `<i class="fa fa-play"></i>`
            button.onclick = () => {
                audio.classList.toggle("aw")
                playAudio()
            }
        })

        // Current Duration - Akhir Duration
        audio.onloadeddata = () => {
            progressAudio.max = audio.duration;
            let
            menitAkhir = Math.floor(audio.duration / 60),
            detikAkhir = Math.floor(audio.duration % 60);

            audioDuration.textContent = `${menitAkhir}:${detikAkhir}`

            setInterval(() => {
                let
                currentMenit = Math.floor(audio.currentTime / 60),
                currentDetik = Math.floor(audio.currentTime % 60);

                progressAudio.value = audio.currentTime
                audioCurrentDuration.textContent = `${currentMenit}:${currentDetik}`

                if (Math.floor(audio.currentTime) === Math.floor(audio.duration)) {
                    console.log('aw');
                    if (audio.loop === true) {
                        return playAudio()
                    }
                    if (isShuffle === true) idx = shuffleAudio(data);
                    else idx++;
                    playNewAudio(data, idx)
                }
            }, 1000)
        }
        progressAudio.onchange = () => audio.currentTime = progressAudio.value

        // Shuffle Audio
        try {
            shuffleAudioEl.onclick = () => {
                shuffleAudioEl.classList.toggle("active")
                isShuffle = !isShuffle;
            }
        } catch (error) {}

        // Previous - Next
        previousSong.onclick = () => {
            let temp = idx;
            if (isShuffle) {
                idx = shuffleAudio(data)
                if (idx === temp) idx--;
            }
            else idx--;
            if (idx < 0) idx = data.length-1;
            audio.classList.add("aw")
            playNewAudio(data, idx)
        }
        nextSong.onclick = () => {
            let temp = idx;
            if (isShuffle) {
                idx = shuffleAudio(data)
                if (idx === temp) idx++;
            }
            else idx++;
            if (idx > data.length-1) idx = 0;
            audio.classList.add("aw")
            playNewAudio(data, idx)
        }

        // Loop song
        repeatAudio.onclick = () => {
            audio.loop = !audio.loop
            repeatAudio.classList.toggle("active")
        }

        // Adjust volume
        inputVolume.onchange = () => {
            audio.volume = inputVolume.value

            if (audio.volume === 0) return muteAudio.innerHTML = `<i class="fas fa-volume-mute"></i>`;
            muteAudio.innerHTML = `<i class="fa fa-volume-up" aria-hidden="true"></i>`
        }

        // Mute song
        muteAudio.onclick = () => {
            audio.muted = !audio.muted
            if (audio.muted) return muteAudio.innerHTML = `<i class="fas fa-volume-mute"></i>`
            muteAudio.innerHTML = `<i class="fa fa-volume-up" aria-hidden="true"></i>`
        }

    })
    .catch(err => console.log(err))

async function playAudio() {
    if (audio.classList.contains("aw")) {
        await audio.play()
        
        // play-pause btn style
        play_pause.forEach(button => button.innerHTML = `<i class="fa fa-pause" aria-hidden="true"></i>`);

        playingContainer.classList.add("active")
        albumCoverPlaying.classList.add("active");
        albumCoverPlaying.classList.remove("deactive");
    } else{
        audio.pause()
        play_pause.forEach(button => button.innerHTML = `<i class="fa fa-play" aria-hidden="true"></i>`)

        playingContainer.classList.remove("active")
        albumCoverPlaying.classList.remove("active");
        albumCoverPlaying.classList.add("deactive");
    }
}

async function playNewAudio(song, idx) {
    audio.src = await song[idx].link
    playAudio()

    // title - artist
    titleSong.forEach(title => title.innerText = song[idx].title);
    artist.forEach(artist => artist.innerText = song[idx].artist)

    // album cover
    albumCover.forEach(albumCover => {
        albumCover.style.backgroundImage = `url('${song[idx].cover}')`
    })

    isiBaruDidengar(song, idx)
    playAudio()
}

function shuffleAudio(song) {
    return Math.floor(Math.random() * (song.length-0+1)+0)
}

function setLeftTopHoverBox (e, el, left, top) {
    left = e.pageX
    top = e.pageY

    // Set left
    if (e.pageX < (window.innerWidth-100)) {
        hoverBox.style.left = left + el.offsetLeft + 'px';
    } else {
        hoverBox.style.left = left - (el.clientWidth + (el.clientWidth/1.5)) + 'px'
    }

    // Set top
    if (top < (window.innerHeight/2)) {
        hoverBox.style.top = top + el.offsetTop + 'px'
    } else {
        if (left < (window.innerWidth-100))
        hoverBox.style.left = left + 'px';
        hoverBox.style.top = top + el.clientHeight - 20 + 'px'
    }
}
hoverElement.forEach(el => {
    let left, top;

    el.onmouseover = e => {
        if (!el.hasAttribute("disabled")) hoverBox.innerText = el.dataset.hover;
        else hoverBox.innerText = "VIP user only"
        hoverBox.classList.add("active");
        setLeftTopHoverBox(e, el, left, top)
    }
    el.onmousemove = e =>  {
        setLeftTopHoverBox(e, el, left, top)
    }
    el.onmouseout = (e) => {
        hoverBox.innerText = ""
        hoverBox.style.top = "0px"
        hoverBox.style.left = "0px"
        hoverBox.classList.remove("active")
    }
})

// Buka Tutup Player
bukaPlayer.onclick = () => sectionPlayer.classList.add("active")
closePlayer.onclick = () => sectionPlayer.classList.remove("active")

// Buka Tutup User
bukaUser.onclick = () => sectionUser.classList.add("active");
tutupUser.onclick = () =>sectionUser.classList.remove("active");

let penambahan = 0;
async function isiBaruDidengar(song, idx) {
    penambahan++;
    if (penambahan <= 5){
        baruDidengarContainer.innerHTML += `
        <div class="me-2 pe-3 d-flex flex-column align-items-center ps-3" data-id="${song[idx].id}">
            <div id="album-cover" class="" style="background-image: url(${song[idx].cover});"></div>
            <div class="title-artist">
                <p id="title">${await song[idx].title}</p>
                <p id="artist">${await song[idx].artist}</p>
            </div>
        </div>`
    } else{
        penambahan = 0;
        baruDidengarContainer.innerHTML = ``
        baruDidengarContainer.innerHTML += `
        <div class="me-2 pe-3 d-flex flex-column align-items-center ps-3" data-id="${song[idx].id}">
            <div id="album-cover" class="" style="background-image: url(${song[idx].cover});"></div>
            <div class="title-artist">
                <p id="title">${await song[idx].title}</p>
                <p id="artist">${await song[idx].artist}</p>
            </div>
        </div>`
    }
}

function isiListLaguHomeContainer(song) {
    return`
    <div class="d-flex align-items-center justify-content-between w-100 mb-3 text-light" data-id="${song.id}">
        <div class="kiri d-flex">
            <div id="album" style="background-image: url('${song.cover}');" class="me-2"></div>
            <div id="title-artist">
                <p id="title" class="fw-bold">${song.title}</p>
                <p id="artist" class="opacity-50">${song.artist}</p>
            </div>
        </div>
        <div class="kanan"><i class="fas fa-bullseye-pointer    "></i></div>
    </div>`
}

document.onclick = e => {
    clickEffect.style.left = e.pageX - 10 + 'px'
    clickEffect.style.top = e.pageY - 10 + 'px'
    clickEffect.classList.add("active")
    setTimeout(() => {
        clickEffect.classList.remove("active")
    },250)
}