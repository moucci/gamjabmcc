

function getValue() {
    var input = document.querySelector(".pseudo").value;
    localStorage.pseudo = input ;
    document.location.href="accueil.html"; 
};

const valider = document.querySelector(".btn");

valider.addEventListener("click",getValue);

const pseudoo = document.querySelector(".pseudo");

