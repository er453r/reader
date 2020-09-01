import * as Hypher from "hypher";
import * as Polish from "hyphenation.pl";

console.log('main script loaded')

document.addEventListener('DOMContentLoaded', () => {
  console.log('dom loaded')

  // thus is so derp

  let h = new Hypher(Polish);

  console.log(h.hyphenate('Dlaczego to nie działa a jednak jest poprawnie czekolada'))


})
