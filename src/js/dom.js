// @flow
export const canvasEl: ?HTMLElement = document.querySelector('#chart');
export const buttonArea: ?HTMLElement = document.querySelector('.row-title-area');
export const buttonCount: ?HTMLElement = document.querySelector('.row-title-count');
export const buttonAbs: ?HTMLElement = document.querySelector('.row-title-abs');
export const textarea: ?HTMLElement = document.querySelector('#list__search');
export const searchInput: ?HTMLElement = document.querySelector('#list__search');
export const indicator: ?HTMLElement = document.querySelector('#list__indicator');
export const listContainer: ?HTMLElement = document.querySelector('.list__container');
export const keyboardButton: ?HTMLElement = document.querySelector('.keyboard-button');
export const loading: ?HTMLElement = document.querySelector('.loading');
export const resizeBtns: NodeList<HTMLElement> = document.querySelectorAll('.max-min-btn');
export const themeSwitch: ?HTMLElement = document.querySelector('#checkbox');
export const contentTop: ?HTMLElement = document.querySelector('.content-top');
export const contentBottom: ?HTMLElement = document.querySelector('.content-bot');
export const graphMessageEl: ?HTMLElement = document.querySelector('.graph-message');
export const graphTimeframeSelect: ?HTMLElement = document.querySelector('#timeframe');
export const lastUpdateTimeEl: ?HTMLElement = document.querySelector('.day-updated');
export const tableDivs: { [string]: ?HTMLElement } = {
  confirmed: document.querySelector('.cases-confirmed'),
  recovered: document.querySelector('.cases-recovered'),
  deaths: document.querySelector('.cases-deaths'),
  totalOrNew: document.querySelector('.total-or-new'),
};

export const getListRows = (): ?NodeList<HTMLElement> => listContainer?.querySelectorAll('.list__row');
export const getActiveListRow = (): ?HTMLElement => listContainer?.querySelector('.list__row_active');
