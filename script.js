const h1 = document.getElementById('strategy')
const card = document.getElementById('card')
const nextButton = document.getElementById('next')
const previousButton = document.getElementById('previous')
let prompts = []
let drawn = []
let index = -1
let degrees = 0
let counter = 0

// GET PROMPTS
const makeArray = text => {
    const strategiesArray = text.split('\n')
    return strategiesArray
}

async function getStrategies() {
    const response = await fetch('strategies.txt')
    const text = await response.text()
    return makeArray(text)
}

// CHANGE PROMPT
const change = (strategy) => {
    setTimeout(() => { 
        h1.innerHTML = strategy
        h1.style.transform = `rotateX(${-degrees}deg)`;
    }, 600);
}

const randomize = () => {
    const rand = Math.floor(Math.random()*prompts.length)
    change(prompts[rand])
    drawn.push(prompts[rand])
    prompts.splice(rand, 1)
    index++
}

const next = () => {
    if (prompts.length === 0) return
    degrees += 180
    card.style.transform = `rotateX(${degrees}deg)`;
    if (index < (drawn.length - 1)) {
        index++
        change(drawn[index])
    } else {
        randomize()
    }
}

const previous = () => {
    if (index === 0) return
    index--
    degrees -= 180
    card.style.transform = `rotateX(${degrees}deg)`;
    change(drawn[index])
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {
    prompts = await getStrategies()
    randomize()
})
document.defaultView.addEventListener('keyup', (e) => {
    if (e.code === "ArrowUp") {
        next()
        console.log("nextK")
    } else if (e.code === "ArrowDown") {
        previous()
        console.log("previousK")
    }
})
document.defaultView.addEventListener('click', (e) => {
    e.stopImmediatePropagation()
    next()
    console.log("nextD")
})
nextButton.addEventListener('click', (e) => {
    e.stopImmediatePropagation()
    next()
    console.log("nextB")
})
previousButton.addEventListener('click', (e) => {
    e.stopImmediatePropagation()
    previous()
    console.log("previousB")
})