let players = []
let results = []

let vars = {
    speedRandomness:3,
    minSpeed:5,
    minStepTime: 200,
    stepTimeRandomness: 300
}

class player{
    constructor(name, i, clr){
        this.name = name
        this.i = i
        this.x = 0
        this.running = true
        this.position = 0
        clr == 'n' ? this.clr = Math.random() * 360 : this.clr = clr
    }

    start(){
        this.x = 0
        this.running = true
        this.position = 0
        this.step()
    }
    
    step(){
        this.x += vars.minSpeed
        this.x += vars.speedRandomness * Math.random()

        if (this.x >= 100) {
            this.end()
        } else {
            window.setTimeout((i) => {
                players[i].step()
            }, (vars.minStepTime + (vars.stepTimeRandomness * Math.random())), this.i);
        }

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
        elm.style.animation = 'input-out .3s ease'
        window.setTimeout((elm) => {
            elm.remove()
        }, 275, elm);
    }
    if (document.getElementsByClassName('name-input')[document.getElementsByClassName('name-input').length - 1].value.trim() != '') {
        const newName = document.createElement('input')
        newName.setAttribute('class', 'name-input')
        newName.setAttribute('oninput', 'updateInput(this)')
        document.getElementById('setup-names').appendChild(newName)
    }
}


function createRace(save) {
    for (let i = 0; i < document.getElementsByClassName('name-input').length - 1; i++) {
        players[i] = new player(document.getElementsByClassName('name-input')[i].value.trim(), i, 'n')
    }
    if (players.length < 2) {
        console.log('Please enter at least 2 players')
    } else {
        save ? localStorage.setItem('players', JSON.stringify(players)) : undefined
        loadRace(false)
    }
}

function loadRace(load) {
    if (load) {
        players = JSON.parse(localStorage.getItem('players'))
        for (let i = 0; i < players.length; i++) {
            players[i] = new player(players[i].name, i, players[i].clr)
        }
    }

    document.getElementById('players-container').innerHTML = ''
    for (let i = 0; i < players.length; i++) {
        const newPlayerElement = document.createElement('div')
        newPlayerElement.setAttribute('class', 'player-bar')
        newPlayerElement.setAttribute('id', 'player-bar' + i)

        newPlayerElement.innerHTML = `
            <div class="player-name">${players[i].name}</div>
            <div id='player${i}' class='player'></div>
        `
        document.getElementById('players-container').appendChild(newPlayerElement)
        document.getElementById('player' + i).style.backgroundColor = 'hsl(' + players[i].clr + ', 100%, 50%)'
    }

    document.getElementById('setup').setAttribute('show', false)
    document.getElementById('race').setAttribute('show', true)

    //start
    window.setTimeout(() => {
        for (let i = 0; i < players.length; i++) {
            players[i].start()
        }
    }, 1000)
}

function endRace() {
    for (let i = 0; i < players.length; i++) {
        results[players[i].position] = players[i].name
    }
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



// start script

for (let i = 0; i < document.getElementsByClassName('name-input').length; i++) {
    const elm = document.getElementsByClassName('name-input')[i]
    elm.setAttribute('oninput','updateInput(this)')
}
