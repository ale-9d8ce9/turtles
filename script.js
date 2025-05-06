let players = []
let results = []

let vars = {
    speedRandomness: 4,
    minSpeed: 2,
    minStepTime: 200,
    stepTimeRandomness: 300,
    currentCostume: 'turtle'
}

class player{
    constructor(name, i, clr){
        this.name = name
        this.i = i
        this.x = 0
        this.running = true
        this.position = 0
        clr == 'n' ? this.clr = Math.round(Math.random() * 360) : this.clr = clr
    }

    start(){
        this.x = 0
        this.running = true
        this.position = 0
        document.getElementById('player' + this.i).style.transition = (vars.minStepTime / 1000) + 's linear'
        document.getElementById('player' + this.i).style.left = '0%'
        window.setTimeout(() => {
            this.step()
        }, vars.minStepTime)
    }
    
    step(){
        this.x += vars.minSpeed
        this.x += vars.speedRandomness * Math.random()
        this.timeNextStep = vars.minStepTime + (vars.stepTimeRandomness * Math.random())

        if (this.x >= 100) {
            this.end()
        } else {
            window.setTimeout((i) => {
                players[i].step()
            }, this.timeNextStep, this.i);
        }

        document.getElementById('player' + this.i).style.transition = (this.timeNextStep / 1000) + 's linear'
        document.getElementById('player' + this.i).style.left = this.x + '%'
    }

    end(){
        this.x = 100
        this.running = false
        for (let i = 0; i < players.length; i++) {
            if (!players[i].running) {
                this.position++
            }
        }
        this.position--
        if (this.position == players.length - 1) {
            endRace()
        }
    }
}


function updateInput(elm) {
    if (elm.value.trim() == '' & document.getElementsByClassName('name-input').length > 1) {
        elm.setAttribute('empty', true)
        window.setTimeout((elm) => {
            elm.value.trim() == '' ? elm.remove() : elm.setAttribute('empty', false)
        }, 400, elm);
    }
    if (document.getElementsByClassName('name-input')[document.getElementsByClassName('name-input').length - 1].value.trim() != '') {
        const newName = document.createElement('input')
        newName.setAttribute('class', 'name-input')
        newName.setAttribute('oninput', 'updateInput(this)')
        document.getElementById('setup-names').appendChild(newName)
    }
}


function createPlayers() {
    players = []
    for (let i = 0; i < document.getElementsByClassName('name-input').length - 1; i++) {
        players[i] = new player(document.getElementsByClassName('name-input')[i].value.trim(), i, 'n')
    }
    createRace()
}
    
function createRace() {
    if (players.length < 2) {
        alert('inserire almeno 2 giocatori')
    } else {
        results = []
        loadRace()
    }
}

function loadRace() {
    document.getElementById('players-container').innerHTML = ''
    for (let i = 0; i < players.length; i++) {
        const newPlayerElement = document.createElement('div')
        newPlayerElement.setAttribute('class', 'player-bar')
        newPlayerElement.setAttribute('id', 'player-bar' + i)

        newPlayerElement.innerHTML = `
            <div class="player-name">${players[i].name}</div>
            <div id='player${i}' class='player'>
                <img src="costumes/${vars.currentCostume}.svg" style="filter: hue-rotate(${players[i].clr}deg)">
            </div>
        `
        document.getElementById('players-container').appendChild(newPlayerElement)
    }

    document.getElementById('setup').setAttribute('show', false)
    document.getElementById('race').setAttribute('show', true)
}

function startRace(delay) {
    window.setTimeout(() => {
        for (let i = 0; i < players.length; i++) {
            players[i].start()
        }
    }, delay)
}

function endRace() {
    results = []
    for (let i = 0; i < players.length; i++) {
        results[players[i].position] = players[i].name
    }
    openResults()
}

function openResults() {
    document.getElementById('results-container').innerHTML = ''
    for (let i = 0; i < results.length; i++) {
        document.getElementById('results-container').innerHTML += `
            <div class="results-line">
                <div class="results-place">${i + 1}</div>
                <div class="results-names" style="transition-delay:${i * 0.1}s">
                    <div class="results-name1" style="transition-delay:${i * 0.1}s">${results[i]}</div>
                    <div class="results-name2" style="transition-delay:${i * 0.1}s">${results[(results.length - 1) - i]}</div>
                </div>
            </div>
        `
    }
    document.getElementById('results').setAttribute('show', true)
}

function save() {
    localStorage.setItem('players', JSON.stringify(players))
    localStorage.setItem('results', JSON.stringify(results))
}

function load() {
    players = JSON.parse(localStorage.getItem('players'))
    if (players.length < 2) {
        alert('nessun giocatore salvato')
    } else {
        for (let i = 0; i < players.length; i++) {
            players[i] = new player(players[i].name, i, players[i].clr)
        }
        createRace()
        results = JSON.parse(localStorage.getItem('results'))
        results.length < 2 ? undefined : openResults()
    }
}


// start script

for (let i = 0; i < document.getElementsByClassName('name-input').length; i++) {
    const elm = document.getElementsByClassName('name-input')[i]
    elm.setAttribute('oninput','updateInput(this)')
}
