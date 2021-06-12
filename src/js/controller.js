import { setGraphTheme } from './components/graph';
import { loading, searchInput, themeSwitch } from './dom';

export const handleThemeSwitchClick = () => {
  const isDayTheme = document.body.classList.contains('day');

  setGraphTheme(isDayTheme ? 'night' : 'day');
  document.body.classList.toggle('day');
  localStorage.setItem('isDayTheme', !isDayTheme);
};

export const applySavedTheme = () => {
  const isDayThemeSaved = localStorage.getItem('isDayTheme');

  if (isDayThemeSaved === 'true') {
    themeSwitch.setAttribute('checked', isDayThemeSaved);
    handleThemeSwitchClick();
  }
};

export const handleResizeClick = (event) => {
  document.querySelector('.content-top').classList.toggle('flex');
  const target = event.target.parentElement;
  event.target.classList.toggle('min');
  Array.from(document.querySelectorAll('.resizable'))
    .filter((div) => div !== target)
    .forEach((div) => div.classList.toggle('hidden'));
  target.classList.toggle('fit-window');
};

export const handleListSearch = () => {
  const input = document.querySelector('#list__search');
  const filter = input.value.toUpperCase();
  const rows = Array.from(document.getElementsByClassName('list__row'));

  rows.forEach((element) => {
    const row = element;
    const countryName = row.children[0].textContent;
    if (countryName.toUpperCase().indexOf(filter) >= 0) row.style.display = '';
    else row.style.display = 'none';
  });
};

export const handleListClick = (event) => {
  const target = event.target.parentElement;
  const activeElement = document.querySelector('.list__row_active');
  if (!target.classList.contains('list__row')) return;

  if (activeElement) activeElement.classList.remove('list__row_active');
  target.classList.add('list__row_active');
  if (activeElement === target) {
    target.classList.remove('list__row_active');
    setTimeout(() => document.querySelector('.row-title-area').dispatchEvent(new Event('click')), 50);
  }
  searchInput.value = '';
  handleListSearch();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const hideLoadingMessage = () => {
  loading.classList.add('hidden');
  document.querySelector('.content-top').classList.remove('hidden');
  document.querySelector('.content-bot').classList.remove('hidden');
};
