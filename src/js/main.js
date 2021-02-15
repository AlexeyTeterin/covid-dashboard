import './graph.js';
import './map.js';
import { indicator } from './list.js';

const resizeBtns = document.querySelectorAll('.max-min-btn');
const checkbox = document.querySelector('#checkbox');
const list = document.querySelector('.list');

const toggleNightMode = () => {
  if (checkbox.checked) console.log('day');
  document.body.classList.toggle('day');
  // list.classList.toggle('day');
  // indicator.classList.toggle('day');
};

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

checkbox.addEventListener('click', toggleNightMode);
