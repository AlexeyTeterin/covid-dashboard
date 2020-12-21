import { getSummary, getCountries } from './CovidData.js';

// getSummary()
//  .then((res) => console.log(res));

// getCountries()
//  .then((res) => console.log(res));

import { buttonAbs, buttonCount } from './table.js';
import { indicator, list } from './list.js';

const resizeBtns = document.querySelectorAll('.max-min-btn');

buttonAbs.addEventListener('click', () => {
  const options = Array.from(list.querySelectorAll('option'));
  const selectedOption = options.filter((option) => option.selected)[0].value;
  options.forEach((option) => option.setAttribute('selected', false));

  const totalCasesOn = buttonCount.classList.contains('total');
  const absValuesOn = buttonAbs.classList.contains('absolute');
  const totalOrNew = totalCasesOn ? 'Total' : 'New';
  const absOrRel = absValuesOn ? 'Per100k' : '';
  const casesType = selectedOption.replace(/(New)|(Total)|(Per100k)/g, '');
  indicator.value = `${totalOrNew}${casesType}${absOrRel}`;

  const targetOption = options.filter((option) => option.value === indicator.value)[0];
  targetOption.setAttribute('selected', true);

  indicator.dispatchEvent(new Event('change'));

  buttonAbs.classList.toggle('absolute');
  buttonAbs.classList.toggle('relative');
});

buttonCount.addEventListener('click', () => {
  const totalCasesOn = buttonCount.classList.contains('total');
  const absValuesOn = buttonAbs.classList.contains('absolute');
  const options = Array.from(list.querySelectorAll('option'));
  const selectedOption = options.filter((option) => option.selected)[0].value;
  options.forEach((option) => option.setAttribute('selected', false));

  const totalOrNew = totalCasesOn ? 'New' : 'Total';
  const absOrRel = absValuesOn ? '' : 'Per100k';
  const casesType = selectedOption.replace(/(New)|(Total)|(Per100k)/g, '');
  indicator.value = `${totalOrNew}${casesType}${absOrRel}`;

  const targetOption = options.filter((option) => option.value === indicator.value)[0];
  targetOption.setAttribute('selected', true);

  indicator.dispatchEvent(new Event('change'));

  buttonCount.classList.toggle('total');
  buttonCount.classList.toggle('new');
});

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
