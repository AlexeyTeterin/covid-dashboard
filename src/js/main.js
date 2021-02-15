import './graph';
import { switchGraphTheme } from './graph';
import './map';

const resizeBtns = document.querySelectorAll('.max-min-btn');
const themeSwitch = document.querySelector('#checkbox');

const onThemeSwitchClick = () => {
  const isDayTheme = document.body.classList.contains('day');
  document.body.classList.toggle('day');
  switchGraphTheme(isDayTheme ? 'night' : 'day');
}

const onResizeClick = (event) => {
  document.querySelector('.content-top').classList.toggle('flex');
  const target = event.target.parentElement;
  event.target.classList.toggle('min');
  Array.from(document.querySelectorAll('.resizable'))
    .filter((div) => div !== target)
    .forEach((div) => div.classList.toggle('hidden'));
  target.classList.toggle('fit-window');
};

resizeBtns.forEach((btn) => btn.addEventListener('click', onResizeClick));
themeSwitch.addEventListener('click', onThemeSwitchClick);
