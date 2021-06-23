// @flow
import { casePrefixes, caseTypes, tableTitles } from '../constants';
import {
  buttonAbs,
  buttonArea,
  buttonCount,
  indicator,
  listContainer,
  tableDivs,
} from '../dom';
import { capitalize, round } from '../utils';
import { getFlagURL, globalStats } from '../model';
import type { caseNames, ITableState } from './types';

const actualStats = {};

const state: ITableState = {
  allTime: true,
  absolute: true,
  confirmed: 0,
  recovered: 0,
  deaths: 0,
  resetToGlobalStats() {
    Object.assign(actualStats, globalStats);
  },
};

const setStats = (): void => caseTypes.forEach((caseName: caseNames) => {
  const prefix: string = capitalize(state.allTime ? casePrefixes.total : casePrefixes.new);
  const statName: string = `${prefix}${capitalize(caseName)}`;
  const delimiter: number = state.absolute ? 1 : +actualStats.population / 100000;
  const targetEl: ?HTMLElement = tableDivs[caseName];

  state[caseName] = +actualStats[statName];
  if (targetEl) targetEl.innerText = round(state[caseName] / delimiter).toLocaleString();
});

const getSelectedCaseType = (): string => {
  const options: ?NodeList<HTMLOptionElement> = indicator?.querySelectorAll('option');
  if (!(indicator instanceof HTMLSelectElement) || !options) return '';
  const selectedOptionValue: string = Array.from(options)
    .filter((option: HTMLOptionElement) => option.selected)[0].value;
  const targetOption: HTMLOptionElement = Array.from(options)
    .filter((option: HTMLOptionElement) => option.value === indicator.value)[0];

  options.forEach((option: HTMLOptionElement) => option.setAttribute('selected', 'false'));
  targetOption.setAttribute('selected', 'true');

  return selectedOptionValue.replace(/(New)|(Total)|(Per100k)/g, '');
};

const dispatchListUpdate = () => setTimeout(() => indicator?.dispatchEvent(new Event('change')), 0);

const toggleTotal = (): void => {
  const prefix: string = capitalize(!state.allTime ? casePrefixes.total : casePrefixes.new);
  const postfix: string = state.absolute ? '' : 'Per100k';
  const caseType: string = getSelectedCaseType();

  if (!(indicator instanceof HTMLSelectElement)) return;

  indicator.value = `${prefix}${caseType}${postfix}`;

  state.allTime = !state.allTime;

  if (tableDivs.totalOrNew) {
    tableDivs.totalOrNew.innerHTML = state.allTime ? tableTitles.total : tableTitles.new;
  }

  dispatchListUpdate();
  buttonCount?.classList.toggle('total');
  buttonCount?.classList.toggle('new');
  setStats();
};

const toggleAbs = (): void => {
  const prefix: string = capitalize(state.allTime ? casePrefixes.total : casePrefixes.new);
  const postfix: string = state.absolute ? 'Per100k' : '';
  const caseType: string = getSelectedCaseType();

  if (!(indicator instanceof HTMLSelectElement)) return;

  indicator.value = `${prefix}${caseType}${postfix}`;
  state.absolute = !state.absolute;
  document.querySelectorAll('.tail').forEach((el: HTMLElement) => {
    el.innerHTML = state.absolute ? '' : '&nbsp;per 100 k';
  });

  dispatchListUpdate();
  buttonAbs?.classList.toggle('absolute');
  buttonAbs?.classList.toggle('relative');
  setStats();
};

const handleListClick = (event: Event): void => {
  const { target } = event;
  if (!(target instanceof HTMLElement)) return;
  const listRows: Array<HTMLElement> = Array.from(listContainer?.querySelectorAll('.list__row') || []);
  const clickedRow = target.parentElement;
  if (!(clickedRow instanceof HTMLElement)) return;
  const clickedCountryCode: string = clickedRow.dataset.CountryCode;
  const getActualStats = (): {} => {
    const targetRow = listRows
      .find((row: HTMLElement) => row.dataset.CountryCode === clickedCountryCode);
    if (!(targetRow instanceof HTMLElement)) return {};
    return targetRow.dataset;
  };

  if (!clickedCountryCode) return;

  Object.assign(actualStats, getActualStats() || globalStats);

  if (!buttonArea) return;
  buttonArea.innerHTML = `<span>ww</span>${actualStats.Country || ''}`;
  if (!(buttonArea.firstChild instanceof HTMLElement)) return;
  buttonArea.firstChild.style.setProperty('background-image', getFlagURL(actualStats.CountryCode || ''));
  setStats();
};

const handleIndicatorChange = (event: Event): void => {
  if (!(event.target instanceof HTMLSelectElement)) return;
  const { value } = event.target;

  if (value.includes('Total') !== buttonCount?.classList.contains('total')) toggleTotal();
  if (value.includes('100k') === buttonAbs?.classList.contains('absolute')) toggleAbs();
  setStats();
};

export const resetTable = (): void => {
  if (buttonArea) buttonArea.innerText = 'World';

  state.resetToGlobalStats();
  setStats();

  const activeListRow: ?HTMLElement = document.querySelector('.list__row_active');
  const click: Event = new Event('click', { bubbles: true });
  if (activeListRow) activeListRow.firstChild?.dispatchEvent(click);
};

buttonCount?.addEventListener('click', toggleTotal);
buttonAbs?.addEventListener('click', toggleAbs);
buttonArea?.addEventListener('click', resetTable);
listContainer?.addEventListener('click', handleListClick);
indicator?.addEventListener('change', handleIndicatorChange);

export default globalStats;
