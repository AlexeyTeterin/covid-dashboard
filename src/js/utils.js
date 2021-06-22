// @flow
import { lastUpdateTimeEl } from './dom';

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export const calcPer100k = (value, population) => +((value / population) * 100000)
  .toFixed(2);

export const setUpdateTime = (updated) => {
  const date = new Date(updated);
  lastUpdateTimeEl
    .innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const calcCasesPer100k = (casesByDay, population) => casesByDay
  .map((el) => ((el / population) * 100000).toFixed(2));
