import * as Hypher from "hypher";
import * as Polish from "hyphenation.pl";

console.log('main script loaded')

const WORD = /^[\wżźćńółęąś]+/i
const PAUSE = /^[,:()]/
const SENTENCE = /^[;.?!]/
const WHITESPACE = /^[\s]+/

const parts = [WORD, PAUSE, SENTENCE, WHITESPACE]

function reader(input){
  let sentenceStart = true

  const reader = document.querySelector("#reader")

  iterator: while(input.length !== 0){
    for (let i = 0; i < parts.length; i++){
      const part = parts[i];
      let match = input.match(part)

      if(match){
        match = match[0]

        console.log(`Found match "${match}"`)

        const p = document.createElement("span")
        p.innerText = match

        if(part === WORD){
          console.log("Matched WORD")

          p.className = "reader word "

          if(sentenceStart){
            p.className += "first-word"

            sentenceStart = false
          }
        }

        if(part === PAUSE){
          console.log("Matched PAUSE")

          p.className = "reader pause"
        }

        if(part === SENTENCE){
          console.log("Matched SENTENCE")

          p.className = "reader sentence"

          sentenceStart = true
        }

        if(part === WHITESPACE){
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

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded')

  // let h = new Hypher(Polish);

  // console.log(h.hyphenate('Dlaczego to nie działa a jednak jest poprawnie czekolada'))

  const text = document.querySelector("#input").value

  reader(text)
})
