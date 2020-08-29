import * as Hypher from "hypher";
import * as Polish from "hyphenation.pl";

console.log('main script loaded')

document.addEventListener('DOMContentLoaded', () => {
  console.log('dom loaded')

  let h = new Hypher(Polish);

  console.log(h.hyphenate('Dlaczego to nie działa a jednak jest poprawnie czekolada'))

  console.log(h.hyphenate('jednak'))
  console.log(h.hyphenate('jest'))
  console.log(h.hyphenate('poprawnie'))
  console.log(h.hyphenate('czekolada'))
})
