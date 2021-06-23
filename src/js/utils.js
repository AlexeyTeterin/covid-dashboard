// @flow
import { lastUpdateTimeEl } from './dom';

export const capitalize = (str: string): string => str[0].toUpperCase() + str.slice(1);

export const calcPer100k = (value: number, population: number): number => +((value
  / population) * 100000).toFixed(2);

export const setUpdateTime = (updated: number): void => {
  if (!lastUpdateTimeEl) return;
  const date: Date = new Date(updated);
  lastUpdateTimeEl.innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const calcCasesPer100k = (casesByDay: Array<number>,
  population: number): Array<string> => casesByDay
  .map((el) => ((el / population) * 100000).toFixed(2));

export const round = (n: number): number => Math.round(n * 100) / 100;
