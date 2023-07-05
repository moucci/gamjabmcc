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

