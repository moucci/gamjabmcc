let player;

/**
 * get player in storage
 * @type {Object}
 */
let playerInStorage = localStorage.getItem('player');

/**
 * définir le jouer par defautfr_FR
 * qui se trouve dans le storage ou cree un nouveau
 */
if (playerInStorage === null) {
    //login  of user 
    player = {
        name: "anonyme",
        score: '0',
    }

    //save data in storage
    updateUserInStorage();

} else {
    player = JSON.parse(playerInStorage);
}

// * get element INPUT for name player
// * @type {Element}
// */
let input = document.querySelector(".Pseudo");

/**
* get btn element  edit name
* @type {Element}
*/
const btn_stylo = document.querySelector("#btn_edit_login");

//set player name in input
input.value = player.name;

//bind event  click on  btn_stylo for edit name
btn_stylo.addEventListener("click", enableinput)

function enableinput() {


    let pathImg = "btnVld.png";


    let img = this.querySelector("img");


    if (input.disabled) {

        input.disabled = false;
        img.setAttribute('src', pathImg);
        this.style.opacity = "1"

    } else {

        input.disabled = true;
        img.setAttribute('src', 'stylo.svg');
        this.style.opacity = "0.5"

        if (input.value.length !== 0) {
            player.name = input.value;
        }


        //save dada in storage
        updateUserInStorage();

    }
}

function updateUserInStorage() {
    localStorage.player = JSON.stringify(player);
}



var scores = [
    { nom: "corentin gaming", score: 66666 },
    { nom: "Jane Smith", score: 4465 },
    { nom: "Bob Johnson", score: 365464 },
    { nom: "corentin gaming", score: 66666 },
    { nom: "corentin gaming", score: 66666 },
    { nom: "corentin gaming", score: 66666 },
    { nom: "corentin gaming", score: 66666 },
  ];


function addScoresToTable(scores) {
    var tbody = document.getElementById('score');

    for (var i = 0; i < scores.length; i++) {
        var row = document.createElement('tr');
        var playerCell = document.createElement('td');
        var scoreCell = document.createElement('td');

        playerCell.textContent = scores[i].nom;
        scoreCell.textContent = scores[i].score;

        row.appendChild(playerCell);
        row.appendChild(scoreCell);
        tbody.appendChild(row);
      }
    }

    addScoresToTable(scores);