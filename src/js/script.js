import * as Hypher from "hypher";
import * as Polish from "hyphenation.pl";

console.log('main script loaded')

const WORD = /^[\wżźćńółęąś]+/i
const PAUSE = /^[,:()]/
const SENTENCE = /^[;.?!]/
const WHITESPACE = /^[\s]+/

const parts = [WORD, PAUSE, SENTENCE, WHITESPACE]
const h = new Hypher(Polish);

function seededRandom(seedInt) {
    const x = Math.sin(seedInt) * 10000;
    return x - Math.floor(x);
}

function randomInt(min, max, seedInt) {
    return Math.floor(seededRandom(seedInt) * (max - min + 1)) + min;
}

function randomColor(seedInt){
    const h = randomInt(0, 360, seedInt)
    const s = randomInt(42, 98, seedInt)
    const l = randomInt(40, 90, seedInt)

    return `hsl(${h},${s}%,${l}%)`
}

function readerPrepare(input) {
    let sentenceStart = true

    const reader = document.querySelector("#reader")

    iterator: while (input.length !== 0) {
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            let match = input.match(part)

            if (match) {
                match = match[0]

                console.log(`Found match "${match}"`)

                const p = document.createElement("span")

                if (part === WORD) {
                    console.log("Matched WORD")

                    p.className = "reader word"

                    const parts = h.hyphenate(match)

                    for(let i = 0; i < parts.length; i++){
                        const part = parts[i]

                        const partSpan = document.createElement("span")

                        if(sentenceStart && i === 0)
                            partSpan.innerHTML = `<span class="first-letter">${part.substr(0, 1)}</span>${part.substr(1)}`
                        else
                            partSpan.innerHTML = part

                        let seed = 1

                        const seedPart = part.toLocaleLowerCase()

                        for(let n = 0; n < seedPart.length; n++)
                            seed *= seedPart.charCodeAt(n)

                        partSpan.style.backgroundColor = randomColor(seed)
                        p.append(partSpan)
                    }

                    if (sentenceStart) {
                        p.className += " first-word"

                        sentenceStart = false
                    }
                }

                if (part === PAUSE) {
                    console.log("Matched PAUSE")

                    p.innerText = match
                    p.className = "reader pause"
                }

                if (part === SENTENCE) {
                    console.log("Matched SENTENCE")

                    p.innerText = match
                    p.className = "reader sentence"

                    sentenceStart = true
                }

                if (part === WHITESPACE) {
                    console.log("Matched WHITESPACE")

                    p.innerText = match
                    p.className = "reader whitespace"
                }

                reader.append(p)

                input = input.substr(match.length)

                continue iterator
            }
        }

        throw new Error(`Could not find match for: "${input.substr(0, 20)}(...)"`)
    }

    console.log("Parsed entire input!")
}

function readerNext() {
    console.log("Reader next!")

    const current = document.querySelector(".reader.current")

    if (current === null) {
        console.log("Trying to find first word...")

        const startWord = document.querySelector(".reader.word")

        console.log(`First word is "${startWord.innerHTML}"`)

        startWord.classList.add("current")

        readerUpdate()
    } else {
        console.log(`Found current: "${current.innerHTML}"`)

        current.classList.remove("current")

        let next = current.nextElementSibling

        while (next != null) {
            if (next.matches(".reader.word")) {
                next.classList.add("current")

                break
            }
            else
                next = next.nextElementSibling
        }

        if(next) {
            console.log(`Next is: "${next.innerHTML}"`)

            readerUpdate()
        }
    }
}

function readerPrevious() {
    console.log("Reader previous!")

    const current = document.querySelector(".reader.current")

    if (current !== null) {
        console.log(`Found current: "${current.innerHTML}"`)

        current.classList.remove("current")

        let previous = current.previousElementSibling

        while (previous != null) {
            if (previous.matches(".reader.word")) {
                previous.classList.add("current")

                break
            }
            else
                previous = previous.previousElementSibling
        }

        if(previous) {
            console.log(`Previous is: "${previous.innerHTML}"`)

            readerUpdate()
        }
    }
}

function readerUpdate() {
    console.log("Reader update!")

    const currentSentenceParts = document.querySelectorAll(".reader.current-sentence")

    console.log(`found ${currentSentenceParts.length}`)

    for (let i = 0; i < currentSentenceParts.length; i++) {
        console.log(`removing from ${currentSentenceParts[i].innerHTML}`)

        currentSentenceParts[i].classList.remove("current-sentence")
    }

    const current = document.querySelector(".reader.current")

    if(current !== null) {
        let next = current.nextElementSibling

        while (next !== null) {
            next.classList.add("current-sentence")

            console.log(`added to next ${next.innerHTML}`)

            if (next.matches(".reader.sentence"))
                break

            next = next.nextElementSibling
        }

        let previous = current

        while (previous !== null) {
            previous.classList.add("current-sentence")

            console.log(`added to previous ${previous.innerHTML}`)

            if (previous.matches(".reader.first-word"))
                break

            previous = previous.previousElementSibling
        }
    }

    console.log("Reader update done!")
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded')

    const text = document.querySelector("#input").value

    readerPrepare(text)

    readerNext()

    console.log("init done!")
})

document.onkeydown = event => {
    console.log(`Pressed key: ${event.code}`)

    if(event.code === "ArrowRight")
        readerNext()

    if(event.code === "ArrowLeft")
        readerPrevious()
}
