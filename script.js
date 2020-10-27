const h1 = document.getElementById('strategy')
const card = document.getElementById('card')
let result = []
let drawn = []
let index = -1
let degrees = 0
let counter = 0

const change = (strategy) => {
    setTimeout(() => { 
        h1.innerHTML = strategy
        h1.style.transform = `rotateX(${-degrees}deg)`;
    }, 600);
}

const randomize = () => {
    const rand = Math.floor(Math.random()*result.length)
    change(result[rand])
    drawn.push(result[rand])
    result.splice(rand, 1)
    index++
}

const makeArray = text => {
    const strategiesArray = text.split('\n')
    return strategiesArray
}

async function getStrategies() {
    const response = await fetch('strategies.txt')
    const text = await response.text()
    return makeArray(text)
}

document.addEventListener('DOMContentLoaded', async () => {
    result = await getStrategies()
    console.log(result)
    randomize()
})

document.defaultView.addEventListener('keyup', (e) => {
    if (result.length === 0) return
    if (e.keyCode === 38) {
        degrees += 180
        card.style.transform = `rotateX(${degrees}deg)`;
        if (index < (drawn.length - 1)) {
            index++
            change(drawn[index])
        } else {
            randomize()
        }
    }
})


document.defaultView.addEventListener('click', (e) => {
    if (result.length === 0) return
    degrees += 180
    card.style.transform = `rotateX(${degrees}deg)`;
    if (index < (drawn.length - 1)) {
        index++
        change(drawn[index])
    } else {
        randomize()
    }
})

document.defaultView.addEventListener('keyup', (e) => {
    if (index === 0) return
    if (e.keyCode === 40) {
        index--
        degrees -= 180
        card.style.transform = `rotateX(${degrees}deg)`;
        change(drawn[index])
    }
})
