// VARIÁVEIS ----------------------------------------------------------------------------------------------------------------

/* getElementById  pede pro DOM recuperar o elemento pelo seu id (do html) */
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const cover = document.getElementById('cover');
const song = document.getElementById('audio');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progress');
const progressContainer = document.getElementById('progress-container');
const shuffButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

/* agrupando as informações de cada músca em cada variável */
const dejaVu = {
    songName: 'Déjà Vu',
    artist: 'Beyoncé',
    file: "dejavu",
    liked: false,
};

const dangerous = {
    songName: 'Dangerously In Love',
    artist: 'Beyoncé',
    file: "dangerous",
    liked: false,
};

const lemonade = {
    songName: 'Formation',
    artist: 'Beyoncé',
    file: "lemonade",
    liked: false,
};

// AUXILIARES ----------------------------------------------------------------------------------------------------------------

/* deixar variável em false pra não tocar a música assim que entra no site ou deixar as funções de embaralhar e repetir desativadas */
let isPlaying = false;
let isShuffle = false;
let repeatOn = false;

/* juntar todas as variaveis de infos das músicas em uma array.
O parse transforma string em objeto
?? -> operador de coalescência nula */
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [dejaVu, dangerous, lemonade];
/* espalhar ... -> copiar o conteúdo do Array originalPlaylist para o Array sortedPlaylist */
let sortedPlaylist = [...originalPlaylist];

/* variável que sempre vai mudar para apontar a música que quer escutar/exibir */
let index = 0;

// FUNÇÕES ----------------------------------------------------------------------------------------------------------------

function playSong() {
    /* ação de pesquisar pelo seletor, ao invés de procurar pelo DOM vai procrurar pelo play e vai selecionar o elemento que tem dentro dele, no caso o ícone de play. 
    classList é para recuperar todas as classes que esse elemento tem, no caso está selecionando o ícone e quando houver um clique nele ele será removido */
    play.querySelector('.bi').classList.remove('bi-play-circle');
    /* adicionando o ícone de pause, no caso vai substituir o de play quando ele for removido na ação acima */
    play.querySelector('.bi').classList.add('bi-pause-circle');
    /* ação de tocar música */
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector('.bi').classList.add('bi-play-circle');
    play.querySelector('.bi').classList.remove('bi-pause-circle');
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong();
    }
    else {
        playSong();
    }
}

function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        /* querySelecto -> recupera um elemento a partir do seletor (que pode ser id, classe ou mais de um) */
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }
    else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
}

/* atualizando as infos da música pelo js */
function initializeSong() {
    cover.src = `imagens/${sortedPlaylist[index].file}.jpeg`;
    song.src = `audios/${sortedPlaylist[index].file}.mp3`;
    /* innerText -> acessa o conteúdo de dentro da tag, nesse caso songName e bandName */
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

/* função para o botão de voltar música */
function previousSong() {
    if (index === 0) {
        /* se o índice do array sortedPlaylist for 0 não tem como exibir música anterior então vai direto pro fim da sortedPlaylist */
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1;
    }
    /* atualizar a música que o índice estiver indicando */
    initializeSong();
    /* volte já tocando a música */
    playSong();
}

/* função para o botão de avançar música */
function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0;
    }
    else {
        index += 1;
    }
    /* atualizar a música que o índice estiver indicando */
    initializeSong();
    /* avançar já tocando a música */
    playSong();
}

function updateProgress() {
    /* informações da tag de áudio:
    currentTime -> quantos segundos desde o início da música já tocou
    durantion -> duração total da música em segundos */
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

/* função com parâmetro, recuperando info de evento */
function jumpTo(event) {
    /* clientWidth -> propriedade que diz a largura total do elemento */
    const width = progressContainer.clientWidth;
    /* offsetX -> propriedade que diz a largura até onde aconteceu o clique */
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

/* função para embaralhar Array da playlist, através de sorteio dos números dos índices do Array */
function shuffleArray(preshuffArray) {
    /* length informa o tamanho do Array */
    const size = preshuffArray.length;
    /* o índice da casinha (do array) que quero alterar. -1 pq o array se conta de 0 a x, porém a contagem de tamanho é de 1 a x */
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        /* Math é um conjunto de funcionalidades matemáticos do JS.
        random é uma dessas funcionalidades, ele retorna um número aleatório entre 0 e 1.
        floor é outra funcionalidade, ele elimina os números depois da vírgula */
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preshuffArray[currentIndex];
        preshuffArray[currentIndex] = preshuffArray[randomIndex]
        preshuffArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffButtonClick() {
    if (isShuffle === false) {
        isShuffle = true;
        shuffleArray(sortedPlaylist);
        shuffButton.classList.add('button-active');
    }
    else {
        isShuffle = false;
        sortedPlaylist = [...originalPlaylist];
        shuffButton.classList.remove('button-active');
    }
}

function repeatButtonClick() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }
    else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    }
    else {
        playSong();
    }
}

/* função auxiliar para converter a música de segundos para minutos */
function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);
    /* toString -> transforma a info em string/texto.
    padStart -> formatar a string/texto do jeito que você quer, nesse caso escolhemos que a hora tenha sempre dois algarismos, mas se tiver apenas um ele vai preencher o outro algarismo com zero */
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/* função para mostrar o tempo atual da música 
function updateCurrentTime() {
    songTime.innerText = toHHMMSS(song.currentTime);
}
    Não vai precisar mais dela porque como ela vai andar no tempo igual e  junto com a barra foi só juntar o comando na função já existente updateProgress (que antes tinha Bar no nome pq era só dele)
*/
/* função para mostrar o tempo total da música */
function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClick() {
    /* sortedPlaylist[index] é referenta a música da vez */
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    }
    else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist',
        /* stringify -> transforma o objeto em string/texto */
        JSON.stringify(originalPlaylist)
    );
}

// EXECUÇÕES ----------------------------------------------------------------------------------------------------------------

/* chamando a função acima */
initializeSong();

/* addEventListener -> capacidade de escutar eventos, falar qual reação quer pro evento e qual é o evento */
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
/* timeupdate -> é um evento que vai mostrar o avanço da música, será usada na barra de progresso */
song.addEventListener('timeupdate', updateProgress);
/* ended -> avisa quando a música terminar e junto com a função nextOrRepeat, assim que a música terminar ou vai pra próxima ou vai repetir */
song.addEventListener('ended', nextOrRepeat);
/* loadedmetadata -> comunica que já carregou as infos (metadados) da música */
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffButton.addEventListener('click', shuffButtonClick);
repeatButton.addEventListener('click', repeatButtonClick);
likeButton.addEventListener('click', likeButtonClick);