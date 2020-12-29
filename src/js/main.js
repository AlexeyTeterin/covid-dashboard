import './graph.js';
import './map.js';

const resizeBtns = document.querySelectorAll('.max-min-btn');

resizeBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    document.querySelector('.content-top').classList.toggle('flex');
    const target = event.target.parentElement;
    btn.classList.toggle('min');
    Array.from(document.querySelectorAll('.resizable'))
      .filter((div) => div !== target)
      .forEach((div) => div.classList.toggle('hidden'));
    target.classList.toggle('fit-window');
  });
});
