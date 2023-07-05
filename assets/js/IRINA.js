//////////// nom de joueur///////////////
let player;


/**
 * get player in storage
 * @type {Object}
 */
let playerInStorage = localStorage.getItem('player');



/**

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



////////////////////// score///////////////////


let scoresInStorage = localStorage.scores;
function addScoreStorage() {
    if (scoresInStorage === null) {
        scores = []

        scores.push(player);
        //save data in storage
        localStorage.scores = JSON.stringify(scores);


    } else {
        let scores = localStorage.player;

        scores = JSON.parse(player);

        scores.push(player);
        scores.unshift(player);
        if (scores.length > 10) {
            scores = scores.slice(0, 10);
        }
        if (scores.length > 10) {
            scores.pop();
        }

        localStorage.scores = JSON.stringify(player);
    }
}

// addScoreStorage();



let playersInStorage = JSON.parse(localStorage.getItem('player')) || [];

// Sélectionner l'élément du corps du tableau
const tableBody = document.querySelector('#playersTable tbody');

// Générer les lignes du tableau
for (let i = 0; i < playersInStorage.length; i++) {
    const player = playersInStorage[i];

    // Créer une nouvelle ligne
    const row = document.createElement('tr');

    // Créer une cellule pour le nom du joueur
    const nameCell = document.createElement('td');
    nameCell.textContent = player.name;

    // Créer une cellule pour le score du joueur
    const scoreCell = document.createElement('td');
    scoreCell.textContent = player.score;

    // Ajouter les cellules à la ligne
    row.appendChild(nameCell);
    row.appendChild(scoreCell);

    // Ajouter la ligne au corps du tableau
    tableBody.appendChild(row);
}


/////////////////// button ///////////////////
const btnValider = document.querySelector('.btn');

// Activer le bouton "Valider" et rediriger vers une autre page
btnValider.addEventListener('click', function () {
    // Vérifier si le nom du joueur est valide (non vide)
    if (input.value.trim() !== '') {
        // Mettre à jour le nom du joueur
        player.name = input.value;
        // Sauvegarder les données du joueur dans le stockage
        updateUserInStorage();
        // Rediriger vers une autre page
        window.location.href = 'index.html';
    }
});