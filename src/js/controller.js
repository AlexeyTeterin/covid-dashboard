// @flow
import chart from './components/graph';
import { resetMapTheme } from './components/map';
import {
  buttonArea,
  contentBottom,
  contentTop,
  getActiveListRow,
  loading,
  searchInput,
  themeSwitch,
} from './dom';

export const handleThemeSwitchClick = (): void => {
  const slider: ?HTMLElement = document.querySelector('.slider.round');
  const isDayTheme: ?boolean = document.body?.classList.contains('day');

  chart.setGraphTheme(isDayTheme ? 'night' : 'day');
  slider?.setAttribute('data-content', isDayTheme ? '🌒' : '☀️');
  document.body?.classList.toggle('day');
  localStorage.setItem('isDayTheme', String(!isDayTheme));
  resetMapTheme();
};

export const applySavedTheme = (): void => {
  const isDayThemeSaved = localStorage.getItem('isDayTheme');

  if (isDayThemeSaved === 'true') {
    themeSwitch?.setAttribute('checked', isDayThemeSaved);
    handleThemeSwitchClick();
  }
};

export const handleResizeClick = (event: Event): void => {
  const { target } = event;
  if (!(target instanceof HTMLElement)) return;
  const { parentElement } = target;

  contentTop?.classList.toggle('flex');
  parentElement?.classList.toggle('min');
  Array.from(document.querySelectorAll('.resizable'))
    .filter((div) => div !== parentElement)
    .forEach((div) => div.classList.toggle('hidden'));
  parentElement?.classList.toggle('fit-window');
};

export const handleListSearch = (): void => {
  if (!(searchInput instanceof HTMLInputElement)) return;

  const filter = searchInput.value.toUpperCase();
  const rows = Array.from(document.getElementsByClassName('list__row'));

  rows.forEach((element) => {
    const row = element;
    const countryName = row.children[0].textContent;
    if (countryName.toUpperCase().indexOf(filter) >= 0) row.style.display = '';
    else row.style.display = 'none';
  });
};

export const handleListClick = (event: Event) => {
  if (!(event.target instanceof HTMLElement)) return;

  const { parentElement } = event.target;
  const activeElement = getActiveListRow();

  if (!parentElement?.classList.contains('list__row')) return;

  if (activeElement) activeElement.classList.remove('list__row_active');
  parentElement?.classList.add('list__row_active');

  if (activeElement === parentElement) {
    parentElement?.classList.remove('list__row_active');
    setTimeout(() => buttonArea?.dispatchEvent(new Event('click')), 50);
  }
  handleListSearch();
  parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  if (searchInput instanceof HTMLInputElement) searchInput.value = '';
};

export const hideLoadingMessage = (): void => {
  loading?.classList.add('hidden');
  contentTop?.classList.remove('hidden');
  contentBottom?.classList.remove('hidden');
};
