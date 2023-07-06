/**
 * methode to hide html element
 * add function hide to prototype htmlelement
 */
HTMLElement.prototype.hide = function () {
    this.style.display = 'none';
    return this
}
/**
 * methode To show html element
 * add function show to prototype htmlelement
 * @param param {string}
 */
HTMLElement.prototype.show = function (param = 'block') {
    this.style.display = param;
    return this
}

/**
 * Methode generate unique id
 * @param length
 * @return {string}
 */
function randomId(length = 6) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};


/**
 * @import class game
 */
import Game from './game.js';


/**
 * function qui permet de mettre a jour le player dans le storage
 */
function updateUserInStorage() {
    localStorage.player = JSON.stringify(player);
}

/**
 * function qui permet de mettre a jour le player dans le storage
 */
function updateScoreInStorage(scores) {
    localStorage.scores = JSON.stringify(scores);
}

/**
 * @player : {}
 */
let player;

/**
 * @scores : {}
 */
let scores;

/**
 * get player in storage
 * @type {Object}
 */
let scoresInStorage = localStorage.getItem('scores');

/**
 * get player in storage
 * @type {Object}
 */
let playerInStorage = localStorage.getItem('player');


/**
 * définir le jouer par defaut
 * qui se trouve dans le storage ou cree un nouveau
 */
if (playerInStorage === null) {
    //login  of user
    player = {
        name: "anonyme",
        score: '0',
        id: randomId()
    }
    //save data in storage
    updateUserInStorage();
} else
    player = JSON.parse(playerInStorage);


/**
 * définir lists par defaut
 * qui se trouve dans le storage ou cree un nouveau
 */
if (scoresInStorage === null) {
    //list  of user empty
    scores = [];
    scores.push(player)
    updateScoreInStorage(scores)
} else scores = JSON.parse(scoresInStorage);

/**
 * Methode to trier by DESC
 * @param ar
 * @return {*}
 */
function sortByScoreDescending(ar) {
    return ar.sort((a, b) => b.score - a.score);
}

//trier
let sortedPlayers = sortByScoreDescending(scores);
//if we have score push it to el
if (sortedPlayers.length > 0 && sortedPlayers[0].score > 0)
    document.querySelector('.last-score').innerText = 'Score à battre: ' + sortedPlayers[0].score;


/**
 * get element INPUT for name player
 * @type {Element}
 */
let $input = document.querySelector("#login");
//set player name in input
$input.value = player.name;

/**
 * get btn element  edit name
 * @type {Element}
 */
const btnVld = document.querySelector(".btn-submit");
btnVld.addEventListener("click", function () {
    let $input = document.querySelector("#login");
    let $btnPlay = document.querySelector(".form .btn-play");
    if (!/^.{1,50}$/.test($input.value)) {
        $btnPlay.hide();
        alert('Attention : Le champ de login est obligatoire et doit contenir entre 1 et 50 caractères.');
        return false;
    }
    player.name = $input.value;
    $btnPlay.show();
});


/**
 * Get $element dron
 * @type {Element}
 */
const $dragon = document.querySelector("#dragon");
let game = new Game();


/**
 * Genarate random size
 * @return {{width: number, height: number}}
 */
function getRandomSize() {
    const minWidth = 100;
    const maxWidth = 200;
    const minHeight = 80;
    const maxHeight = 160;
    const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    return {width, height};
}

/**
 * generate random position for cloud
 * @return {{x: number, y: number}}
 */
function getRandomPosition() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const positionMin = 100;
    const positionMaxX = screenWidth - 100;
    const positionMaxY = screenHeight - 100;
    const x = Math.floor(Math.random() * (positionMaxX - positionMin + 1)) + positionMin;
    const y = Math.floor(Math.random() * (positionMaxY - positionMin + 1)) + positionMin;
    return {x, y};
}

const cloudTypes = ['a', 'b', 'c'];
const numClouds = 40;
const screenWidth = window.innerWidth;
const positionMaxX = Math.floor(screenWidth / 2) - 100;
/**
 * generate clouds
 */
for (let i = 1; i <= numClouds; i++) {
    const cloud = document.createElement('div');
    const cloudType = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
    cloud.classList.add(`cloud-${cloudType}`);
    const cloudSize = getRandomSize();
    const cloudPosition = getRandomPosition();

    // Adjust cloud position based on its index
    const offset = (i % 2 === 0) ? positionMaxX : -positionMaxX;
    const x = cloudPosition.x + offset;
    const y = cloudPosition.y;

    cloud.style.width = `${cloudSize.width}px`;
    cloud.style.height = `${cloudSize.height}px`;
    cloud.style.top = `${y}px`;
    cloud.style.left = `${x}px`;
    cloud.classList.add(`cloud-${cloudType}`, 'cloud-animate');
    document.querySelector('#game').appendChild(cloud);
    //for home
    if (i < 30) {
        let clone = cloud.cloneNode();
        let cloudB = clone;
        document.querySelector('#home').appendChild(clone);
        document.querySelector('#list-score').appendChild(cloudB);
    }
}

/**
 * bind btn play
 */
document.querySelectorAll('.btn-play').forEach(function ($el) {
    $el.addEventListener("click", function () {
        document.querySelectorAll("section").forEach(function ($el) {
            $el.hide();
        });
        document.querySelector("#game").show();
        game.start(1);
    })
});

/**
 * bind btn to home
 */
document.querySelectorAll('.btn-home').forEach(function ($el) {

    $el.addEventListener("click", function () {
        document.querySelectorAll("section").forEach(function ($el) {
            $el.hide();
        });

        document.querySelector("#home").show();
        let scores = JSON.parse(localStorage.scores);
        //trier
        let sortedPlayers = sortByScoreDescending(scores);
        //if we have score push it to el
        if (sortedPlayers.length > 0 && sortedPlayers[0].score > 0)
            document.querySelector('.last-score').innerText = 'Score à battre: ' + sortedPlayers[0].score;


    })
});

function listScoreOnView() {
    let scores = JSON.parse(localStorage.scores);
    //trier
    let sortedPlayers = sortByScoreDescending(scores);
    //if we have score push it to el
    if (sortedPlayers.length > 0 && sortedPlayers[0].score > 0)
        document.querySelector('.last-score').innerText = 'Score à battre: ' + sortedPlayers[0].score;

    let container = document.querySelector('#list-score ul');
    container.innerHTML = '';

    sortedPlayers.forEach((value, key) => {
        if (key < 7) {
            let $li = document.createElement('li');
            let $spanName = document.createElement('span');
            $spanName.classList.add('name');
            $spanName.textContent = value.name + ' : '; // assuming `value` is an object with a `name` property

            let $spanScore = document.createElement('span');
            $spanScore.classList.add('score');
            $spanScore.textContent = value.score; // assuming `value` is an object with a `score` property

            $li.appendChild($spanName);
            $li.appendChild($spanScore);
            container.appendChild($li);
        }

    });
}

document.querySelectorAll('.btn-list').forEach(function ($el) {

    $el.addEventListener("click", function () {
        document.querySelectorAll("section").forEach(function ($el) {
            $el.hide();
        });
        document.querySelector("#list-score").show();
        listScoreOnView();
    })
});

/**
 * bind btn next to change level
 */
document.querySelector('.btn-next').addEventListener("click", () => {
    document.querySelector("#win").hide();
    document.querySelector("#game").show();
    game.start(game.difficulty + 0.5);
});
listScoreOnView();


