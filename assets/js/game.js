export default class Game {


    /**
     * Container game
     * @var : {HTMLElement}
     */
    container;

    screenW;

    screenH;

    /**
     * Dragon element
     * @var : {HTMLElement}
     */
    dragon;

    /**
     * Postion X of dragon
     * @type Number
     */
    dragonPosX = 0;

    /**
     * Position Y of dragon
     * @type Number
     */
    dragonPosY = 0;

    /**
     * Speed dragon 'px'
     * @type {number}
     */
    dragonMovSpeed = 50;

    /**
     * starting party
     * @type {boolean}
     */
    startParty = false;

    /**
     * lists of rocks
     * @type {{}}
     */
    rocks = {};

    /**
     * interval rocks generation
     */
    generateRocksInterval;

    /**
     * delay for animate rocks
     * @type {number}
     */
    delayAnimateRocks = 40;

    /**
     * max zoom when rock in frame
     * @type {number}
     */
    maxScale = 1.5;
    /**
     * set opacity
     * @type {number}
     */
    minOpacity = 0.5;
    // maxDistance = Math.sqrt(this.screenW ** 2 + this.screenH ** 2);

    /**
     * score user for current party
     * @type {number}
     */
    score = 0;

    /**
     * Pois vital
     * @type {number}
     */
    pv = 100;

    /**
     * coefficient level party
     * @type  {Number}
     */
    difficulty = 1;

    /**
     * @timer : HTMLElement => block global timer
     */
    $timer;

    /**
     * @timerTxt : HTMLElement  => block text timer
     */
    $timerTxt;

    /**
     * @maxTime : maximum time limit per seconde
     */
    maxTime = 30;

    /**
     * @countTime : Number => seconde number under timer graph
     */
    countTime = 0;
    q
    /**
     * reference on interval timer
     */
    refIntervalTimer = null;

    /**
     * @deg : Number => degree rotation for timer and arrow
     */
    deg = 0;

    /**
     * audio play back
     */
    audioPlayBack;
    /**
     * player songs impact
     */
    audioPlayImpact;

    /**
     * player song goat
     */
    audioPlayGoat;

    /**
     * player song  coin
     */
    audioPlayGold


    constructor() {

        //bind container
        this.container = document.querySelector('#game');

        //get size screen
        this.screenW = window.innerWidth;
        this.screenH = window.innerHeight;

        //bind dragon
        this.dragon = document.createElement('div');
        this.dragon.classList.add("dragon");

        //add dragon to container
        this.container.append(this.dragon);

        //set position
        this.setDragonPosition();

        //set pv
        document.querySelector('.pv div').style.width = '100%';


        //set counter Time
        this.countTime = this.maxTime;

        //set $html element html
        this.$timer = document.querySelector('.timer-graphic');

        this.$timerTxt = document.querySelector('.timer-seconde');

        //bind event keyword
        this.bindEventKeys();

    }

    /**
     * Methode to set position of dragon
     * @return void
     */
    setDragonPosition() {

        //new position
        this.dragonPosX = (this.screenW - this.dragon.offsetWidth) / 2;
        this.dragonPosY = this.screenH - ((this.dragon.offsetHeight) + 150);
        this.updateDragonPosition();
    }

    goTop() {
        this.dragonPosY -= this.dragonMovSpeed;
        this.updateDragonPosition();
    }

    goBottom() {
        this.dragonPosY += this.dragonMovSpeed;
        this.updateDragonPosition();
    }

    goLeft() {
        this.dragonPosX -= this.dragonMovSpeed;
        this.updateDragonPosition('left');
    }

    goRight() {
        this.dragonPosX += this.dragonMovSpeed;
        this.updateDragonPosition('right');
    }

    /**
     * Methode to update position dragon
     * @return false ;
     */
    updateDragonPosition(deg = null) {
        // max position
        const maxPosX = this.screenW - 10 - this.dragon.clientWidth;
        const maxPosY = this.screenH - (this.dragon.clientHeight + 100);

        // Limit position
        this.dragonPosX = Math.min(Math.max(this.dragonPosX, 100), maxPosX);
        this.dragonPosY = Math.min(Math.max(this.dragonPosY, this.screenH / 2), maxPosY);

        if (deg === 'left') this.dragon.style.rotate = '-45deg';
        if (deg === 'right') this.dragon.style.rotate = '45deg';

        // Bind new value
        this.dragon.style.top = this.dragonPosY + 'px';
        this.dragon.style.left = this.dragonPosX + 'px';
    }

    /**
     * Methode to  add lister  on keys Directions
     * @return void
     */
    bindEventKeys() {

        /**
         * Listener key { ArrowUp = Top , ArrowDown = bottom , ArrowLeft = left  , ArrowRight = right }
         */
        document.addEventListener('keydown', (e) => {
            //check if party is starting
            if (!this.startParty) return false;

            if (e.key === "ArrowUp") this.goTop();
            if (e.key === "ArrowDown") this.goBottom();
            if (e.key === "ArrowLeft") this.goLeft();
            if (e.key === "ArrowRight") this.goRight();
        });

        //stop et reste position ongle  position
        document.addEventListener('keyup', (e) => {
            this.dragon.style.rotate = '0deg';
        });


    }

    start(level = 1) {
        let $el;
        let time = 1;
        this.difficulty = level
        document.querySelector('header').show('flex');
        this.playBackgroundMusic();
        let interval = setInterval(() => {
            if (!$el) {
                $el = document.createElement("span");
                $el.classList.add("starting");
            }
            $el.innerText = time--;
            this.container.append($el)
            if (time < 0) {
                clearInterval(interval);
                $el.remove();
                // start party
                this.startParty = true;

                // start generate rocks
                this.generateRocks();
                this.updatePositionRocks();
            }
        }, 500);
        this.start_timer();
    }


    stop(process) {

        clearInterval(this.generateRocksInterval);
        this.stopPlayBackMusic();

        //clear all rocks
        document.querySelectorAll(".small-rock").forEach(function ($el) {
            $el.remove();
        })
        this.rocks = {}
        this.pv = 100;
        this.setDragonPosition();
        this.stop_timer();
        document.querySelector('header').hide();
        document.querySelectorAll("section").forEach(function ($el) {
            $el.hide();
        });
        //save score
        this.updateListScoreInStorage()

        //if lose reset all params
        if (!process) {
            document.querySelector("section#lose").show()
        } else {
            document.querySelector("section#win").show();
        }
    }


    generateRocks() {
        let iteration = 0;

        this.generateRocksInterval = setInterval(() => {
            const rock = document.createElement("div");
            rock.classList.add("small-rock");
            const id = this.randomId();
            rock.setAttribute("id", id);

            const x = this.screenW / 2;
            const y = 100;
            let positions;
            let isBigRock = false;
            let isGoat = false;
            let isGold = false;
            let widthBox = 90;

            const randomValue = Math.random();


            // 49% chance to generate a goat
            if (randomValue < 0.05) {
                const direction = this.getRandomDirection();
                positions = {dx: direction.dx, dy: Math.abs(direction.dy)};
                widthBox = 200;
                isGoat = true;
            }
            // 25% chance to generate a gold piece
            else if (randomValue < 0.40) {
                const direction = this.getRandomDirection();
                positions = {dx: direction.dx, dy: Math.abs(direction.dy)};
                widthBox = 30;
                isGold = true;
            }

            //big rock
            else if (randomValue < 0.55) {
                const dx = this.dragonPosX - x;
                const dy = this.dragonPosY - y;
                widthBox = 160;

                const norm = Math.sqrt(dx * dx + dy * dy);
                positions = {dx: dx / norm, dy: dy / norm};
                isBigRock = true;
            }
            // 36% chance to generate a regular rock
            else {
                positions = this.getRandomDirection();
            }

            const speed = (!isGoat && !isGold) ? (Math.random() * (5 + this.difficulty)) + 1 : 6;

            const refEl = {
                id: id,
                x: x,
                y: y,
                widthBox: widthBox,
                positions: positions,
                speed: speed,
                scale: 0,
                opacity: this.minOpacity,
                isBigRock: isBigRock,
                isGoat: isGoat,
                isGold: isGold,
            };

            if (refEl.isBigRock) {
                rock.classList.add("big-rock");
            } else if (refEl.isGoat) {
                rock.classList.add("goat");
            } else if (refEl.isGold) {
                rock.classList.add("gold");
            }

            this.rocks[id] = refEl;
            rock.style.left = `${x}px`;
            rock.style.top = `${y}px`;

            this.container.append(rock);
            iteration++;
        }, 300);
    }


    /**
     * Methode to update Position rocks
     * @return void
     */
    updatePositionRocks = () => {
        for (let id in this.rocks) {
            let rock = this.rocks[id];
            if (!rock.x) break;
            rock.x += rock.positions.dx * rock.speed;
            rock.y += rock.positions.dy * rock.speed;

            let $el = this.container.querySelector('#' + id);
            $el.style.left = `${rock.x}px`;
            $el.style.top = `${rock.y}px`;
            $el.style.display = 'block';

            let distance = Math.sqrt((rock.x - this.screenW / 2) ** 2 + (rock.y - 100) ** 2);
            let maxDistance = Math.sqrt((this.screenW ** 2) + (this.screenH - 100) ** 2);
            rock.scale = (distance / maxDistance) * this.maxScale;
            $el.style.transform = `scale(${rock.scale})`;

            //update opacity
            if (rock.opacity < 1) {
                rock.opacity += 0.01;
                $el.style.opacity = rock.opacity;
            }

            // Check conditions and remove the rock if any is met
            if (rock.x < 0 || rock.x > this.screenW || rock.y < 0 || rock.y > this.screenH) {
                this.checkScore(2);
                this.removeRock($el, id);
            } else if (this.isDragonOverRock(rock.widthBox, this.dragonPosX, this.dragonPosY, rock.x, rock.y, rock.scale)) {
                let pv = 0;
                let score = 0;
                if (rock.isBigRock) {
                    pv = -20;
                    this.playMusicImpact();
                } else if (rock.isGoat) {
                    pv = 5;
                    this.playMusicGoat();

                } else if (rock.isGold) {
                    score = 50;
                    this.playMusicGold();
                } else {
                    pv = -10;
                    this.playMusicImpact();

                }
                this.checkScore(score);
                this.checkPv(pv);
                this.removeRock($el, id);
            } else if (rock.y > this.dragonPosY + 30) {
                this.checkScore(2);
                this.removeRock($el, id);
            } else if (this.isDragonOverRock(rock.widthBox, this.dragonPosX, this.dragonPosY + 30, rock.x, rock.y, rock.scale)) {
                this.checkScore(5);
                this.removeRock($el, id);
            }
        }

        setTimeout(() => {
            this.updatePositionRocks();
        }, this.delayAnimateRocks);
    };

    /**
     * Methode to remove rock
     * @param $el
     * @param id
     */
    removeRock = ($el, id) => {
        $el.remove();
        delete this.rocks[id];
    }

    /**
     * Methode to check if dragon is over rocks
     * @param dragonX
     * @param dragonY
     * @param rockX
     * @param rockY
     * @param rockScale
     * @return {boolean}
     */
    isDragonOverRock(widthHitBox, dragonX, dragonY, rockX, rockY, rockScale) {

        //hitbox
        let hitboxSize = widthHitBox * rockScale;

        // dragon size
        let dragonWidth = this.dragon.offsetWidth;
        let dragonHeight = this.dragon.offsetHeight;

        //  add 30% of wing to dragon width
        let dragonWingExtension = dragonWidth * 0.3;
        dragonWidth += dragonWingExtension;
        dragonX -= dragonWingExtension / 2;

        //calculate new  rockX and rockY
        rockX += rockScale * (widthHitBox / 2);
        rockY += rockScale * (widthHitBox / 2);

        // Create hitboxes for dragon and rock
        let dragonHitbox = {x: dragonX, y: dragonY, width: dragonWidth, height: dragonHeight};
        let rockHitbox = {x: rockX, y: rockY, width: hitboxSize, height: hitboxSize};

        // Check collision
        return this.isColliding(dragonHitbox, rockHitbox);
    }

    /**
     * Methode to check collision
     * @param rect1
     * @param rect2
     * @return {boolean}
     */
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect2.x < rect1.x + rect1.width &&
            rect1.y < rect2.y + rect2.height &&
            rect2.y < rect1.y + rect1.height;
    }

    /**
     * Methode to check pv and manage pv
     * @param pv {number}
     */
    checkPv = (pv) => {
        this.pv += pv;

        // If pv is 0 , player lose stope the game
        if (this.pv < 0) {
            this.pv = 0;
            this.stop(false); // Stop the game if pv is 0
        } else if (this.pv > 100) {
            this.pv = 100;
        }

        // Update the PV bar
        let newWidth = this.pv;  // No need to multiply by 5
        document.querySelector('.pv div').style.width = newWidth + '%';
    };

    /**
     * Methode to add or sub score
     * @param score {Number}
     */
    checkScore = (score) => {
        this.score += score;
        document.querySelector(' .score .val').innerText = this.score;
    }

    /**
     * generate random direction
     * @return {{dx: number, dy: number}|{dx: number, dy: number}|{dx: number, dy: number}|{dx: number, dy: number}}
     */
    getRandomDirection() {
        const dx = Math.random() * 2 - 1; // Valeur aléatoire entre -1 et 1 pour le déplacement horizontal
        const dy = Math.random() * 2 - 1; // Valeur aléatoire entre -1 et 1 pour le déplacement vertical
        return {dx, dy};
    }

    /**
     * Methode to generate random id
     * @param length
     * @return {string}
     */
    randomId = function (length = 6) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };


    /**
     * function start timer and timer rotate
     * @return  void
     */
    start_timer = function () {
        this.refIntervalTimer = setInterval(function () {
            this.countTime--;
            this.deg += 360 / this.maxTime;
            if (this.countTime >= 0) {
                this.timer_rotate(this.$timer, this.deg);
                this.$timerTxt.innerHTML = this.countTime + "S";
                this.animateTimer(this.deg);
            } else {
                this.stop_timer().stop(true);
            }
        }.bind(this), 1000);
    };

    /**
     *
     * @param deg : number of degree from $timer
     */
    animateTimer = function (deg) {
        if (deg > 45 && this.deg < 90) {
            this.$timer.style.animation = "zoom-in-zoom-level-1 0.75s ease infinite";
        } else if (deg > 90 && deg < 180) {
            this.$timer.style.animation = "zoom-in-zoom-level-1 0.50s ease infinite";
        } else if (deg > 180 && deg < 225) {
            this.$timer.style.animation = "zoom-in-zoom-level-1 0.25s ease infinite";
        } else if (deg > 260) {
            let timeAnimation = (360 - deg) * (0.7 / 360) + 0.1;
            this.$timer.style.animation = "zoom-in-zoom-level-1 " + timeAnimation + "s ease infinite";
        } else {
            return false;
        }
    };

    /**
     * function stop timer & reset timer with arrow and conic position
     * @return  this
     */
    stop_timer = function () {
        clearInterval(this.refIntervalTimer);
        this.countTime = this.maxTime;
        this.deg = 0
        this.timer_rotate(this.$timer, 0);
        this.$timerTxt.innerHTML = this.maxTime + "S";
        this.$timer.style.animation = "zoom-in-zoom-level-1 30s ease infinite";
        // Retourner l'objet modifié
        return this;
    };

    /**
     * function rotate arrow timer & edit conic gradiant
     * @param $el : HTMLElement reference of html element  timer
     * @param deg : number
     * @return boolean
     */
    timer_rotate = function ($el, deg) {
        let arrow = $el.querySelector('.arrow')
        let conic = $el.querySelector(".circle")
        arrow.style.transform = "rotate(" + deg + "deg)";
        conic.style.backgroundImage = "repeating-conic-gradient(from 0deg,  #343434 0deg " + deg + "deg,#FFD005 " + deg + "deg 360deg )";
    }


    /**
     * Methode to play music on back
     */
    playBackgroundMusic() {
        this.audioPlayBack = new Audio('assets/songs/playback.mp3');
        this.audioPlayBack.loop = true;
        this.audioPlayBack.play();
    }

    stopPlayBackMusic() {
        this.audioPlayBack.pause();
    }

    playMusicImpact() {
        this.audioPlayImpact = new Audio('assets/songs/impact.mp3');
        this.audioPlayImpact.loop = false;
        this.audioPlayImpact.play();
    }

    playMusicGoat() {
        this.audioPlayGoat = new Audio('assets/songs/goat.mp3');
        this.audioPlayGoat.loop = false;
        this.audioPlayGoat.play();
    }

    playMusicGold() {
        this.audioPlayGold = new Audio('assets/songs/gold.mp3');
        this.audioPlayGold.loop = false;
        this.audioPlayGold.play();
    }

    /**
     * Methode tu update score on storage
     */
    updateListScoreInStorage() {
        //update score
        let player = JSON.parse(localStorage.player)

        //save if this.score is >
        if (this.score < parseInt(player.score)) return false;

        player.score = this.score;
        let listStorage = JSON.parse(localStorage.scores);
        listStorage.forEach((value, k) => {
            if (value.id === value.id) {
                listStorage[k].score = player.score;
            }
        });
        localStorage.scores = JSON.stringify(listStorage);
        localStorage.player = JSON.stringify(player);
    }

}

