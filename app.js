import songs from './audio.js'

const playerList = document.querySelector('.player__list');
const audioContent = document.querySelector('.audio__content');

const songsArr = []
let currentAudio = null;
let currentTrackIndex = 0;
let pause = true;
const time = currentAudio = new Audio(`${songs[currentTrackIndex].link}`)
console.dir(time,currentAudio)

renderSong(currentTrackIndex)
renderTimeCurrent(currentAudio)
renderTimeEnd(currentAudio)

function renderLink(){
    songs.forEach(function(item){
        const link = `
            <li class="player__link audio-link" data-id=${item.id}>
                <div class="audio-link__info">
                    <img src="./img/kino.png" alt="img" class="audio-link__img">
                    <div class="audio-link__names">
                        <p class="audio-link__name-person">${item.group}</p>
                        <p class="audio-link__name-song">${item.track}</p>
                    </div>
                </div>
                <p class="audio-link__time"></p>
                <p class="audio-link__genre">${item.genre}</p>
                <button class="audio-link__play">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                </button>
            </li>
        `
        songsArr.push(item)
        playerList.insertAdjacentHTML('beforeend',link)
        const audio = new Audio(item.link)
        audio.addEventListener('loadedmetadata',function(){
            const itemElement = document.querySelector(`.audio-link[data-id="${item.id}"] .audio-link__time`)
            const formattedTime = formatTime(audio.duration)
            itemElement.textContent = formattedTime
        })
    })
}

function renderCardsAudio(){
    document.addEventListener('click',function(e){
        const link = e.target.closest('.audio-link')
        if(link){
            renderCard(link)
        }
    })
}

function renderCard(link){
    audioContent.innerHTML = ''

    const currentItem = songsArr.filter(function(item){
        return +item.id === +link.dataset.id
    })

    currentTrackIndex = currentItem[0].id - 1
    
    currentAudio.src = songs[currentTrackIndex].link

    renderSong(currentTrackIndex)
    if(!pause){
        currentAudio.play()
        document.querySelector('.play').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`
    }
    renderTimeCurrent(currentAudio)
    renderTimeEnd(currentAudio)
}

function formatTime(time){
    let min = Math.floor(time / 60)
    let second = Math.floor(time % 60)
    if(+min < 10) min = '0' + min 
    if(+second < 10) second = '0' + second

    return `${min}:${second}`
}

function renderTimeCurrent(time){
    const processTimeCurent = document.querySelector('.process__time-curent');
    const progress = document.querySelector('.process__line-progress')
    time.addEventListener('timeupdate',function(e){
        const currentTime = time.currentTime
        const duration = time.duration
        const progressPercent = (currentTime / duration) * 100
        progress.style.width = `${progressPercent}%`
        processTimeCurent.textContent = formatTime(time.currentTime)
    })
}

function renderTimeEnd(time){
    const processTimeCurent = document.querySelector('.process__time-end')
    time.addEventListener('loadedmetadata',function(){
        processTimeCurent.textContent = formatTime(time.duration)
    })
}

document.addEventListener('click',function(e){
    const progress = document.querySelector('.process__line-progress')
    const audio = currentAudio;
    if(e.target.classList.contains('process__line')){
        const clickX = e.clientX
        const rect = e.target.getBoundingClientRect()
        const relativeX = clickX - rect.left
        const totalWidth = rect.width
        const duration = audio.duration
        const newTime = (relativeX  / totalWidth) * duration
        audio.currentTime = newTime
        const progressPercent = (newTime / duration) * 100
        progress.style.width = `${progressPercent}%`
    }
})

time.addEventListener('ended',function(){

    if(document.querySelector('.repeat')){
        currentAudio.src = songs[currentTrackIndex].link
        currentAudio.play()
    }else{
        audioContent.innerHTML = ''
        currentTrackIndex += 1
        if(currentTrackIndex < songs.length){
            currentAudio.src = songs[currentTrackIndex].link
            currentAudio.play()
            renderSong(currentTrackIndex)
        }else{
            currentTrackIndex = 0
            currentAudio.src = songs[0].link
            currentAudio.play()
            renderSong(currentTrackIndex)
        }
        if(!pause){
            document.querySelector('.play').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`
        }
    }
    renderTimeCurrent(currentAudio)
    renderTimeEnd(currentAudio)
})

function renderSong(currentTrackIndex){
    const html = `
    <img class="audio__img" src="./img/kino.png" alt="img">
    <div class="audio__info">
        <div class="audio__info-top">
            <div class="audio__info-names">
                <p class="audio__info-name-person">${songs[currentTrackIndex].group}</p>
                <p class="audio__info-name-song">${songs[currentTrackIndex].track}</p>
            </div>
            <p class="audio__info-year">
                ${songs[currentTrackIndex].year}
            </p>
        </div>
        <div class="audio__info-actions actions">
            <div class="actions__buttons">
                <button class="prev" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-320c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3l0 41.7 0 41.7L459.5 440.6zM256 352l0-96 0-128 0-32c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29l0-64z"/></svg>
                </button>
                <button class="play" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                </button>
                <button class="next" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3l0 41.7 0 41.7L52.5 440.6zM256 352l0-96 0-128 0-32c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29l0-64z"/></svg>
                </button>
            </div>
        </div>
        <div class="audio__info-process process">
            <div class="process__line">
                <div class="process__line-progress"></div>
            </div>
            <div class="process__time">
                <p class="process__time-curent">00:00</p>
                <p class="process__time-end">0</p>
            </div>
        </div>
    </div>
`
    audioContent.insertAdjacentHTML('beforeend',html)
}

document.addEventListener('click',function(e){
    if(e.target.classList.contains('play')){
        pause = !pause
        if(pause){
            currentAudio.pause()
            document.querySelector('.play').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>`
        }else{
            currentAudio.play()
            document.querySelector('.play').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`
        }
    }

    if(e.target.classList.contains('next')){
        audioContent.innerHTML = ''
        currentTrackIndex += 1
        if(currentTrackIndex < songs.length){
            currentAudio.src = songs[currentTrackIndex].link
        }else{
            currentTrackIndex = 0
            currentAudio.src = songs[currentTrackIndex].link
        }
        renderSong(currentTrackIndex)
        if(!pause){
            currentAudio.play()
            document.querySelector('.play').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`
        }
        renderTimeCurrent(currentAudio)
        renderTimeEnd(currentAudio)
    }

    if(e.target.classList.contains('prev')){
        audioContent.innerHTML = ''
        currentTrackIndex -= 1
        if(currentTrackIndex < 0){
            currentTrackIndex = songs.length - 1
            currentAudio.src = songs[currentTrackIndex].link
        }else{
            currentAudio.src = songs[currentTrackIndex].link
        }
        renderSong(currentTrackIndex)
        if(!pause){
            currentAudio.play()
            document.querySelector('.play').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>`
        }
        renderTimeCurrent(currentAudio)
        renderTimeEnd(currentAudio)
    }

    if(e.target.classList.contains('audio__repeat')){
        e.target.classList.toggle('repeat')
    }
})


renderLink()
renderCardsAudio()