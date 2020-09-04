console.log('main script loaded')

const WORD = /^[\wżźćńółęąś]+/i
const PAUSE = /^[,:()]/
const SENTENCE = /^[;.?!]/
const WHITESPACE = /^[\s]+/

const parts = [WORD, PAUSE, SENTENCE, WHITESPACE]

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
                p.innerText = match

                if (part === WORD) {
                    console.log("Matched WORD")

                    p.className = "reader word "

                    if (sentenceStart) {
                        p.className += "first-word"
                        p.innerHTML = `<span class="first-letter">${p.innerText.substr(0, 1)}</span>${p.innerText.substr(1)}`

                        sentenceStart = false
                    }
                }

                if (part === PAUSE) {
                    console.log("Matched PAUSE")

                    p.className = "reader pause"
                }

                if (part === SENTENCE) {
                    console.log("Matched SENTENCE")

                    p.className = "reader sentence"

                    sentenceStart = true
                }

                if (part === WHITESPACE) {
                    console.log("Matched WHITESPACE")

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

    document.querySelectorAll(".reader.current-sentence").forEach(it => {
        it.classList.remove("current-sentence")
    })

    console.log("Reader update 444!")

    const current = document.querySelector(".reader.current")

    console.log("Reader update 123!")

    if(current !== null) {
        let next = current.nextElementSibling

        while (next !== null) {
            next.classList.add("current-sentence")

            if (next.matches(".reader.sentence"))
                break

            next = next.nextElementSibling
        }

        let previous = current

        while (previous !== null) {
            previous.classList.add("current-sentence")

            if (previous.matches(".reader.first-word"))
                break

            previous = previous.previousElementSibling
        }
    }

    console.log("Reader update done!")
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded')

    // let h = new Hypher(Polish);

    // console.log(h.hyphenate('Dlaczego to nie działa a jednak jest poprawnie czekolada'))

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
