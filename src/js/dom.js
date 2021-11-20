export const canvasEl = document.querySelector('#chart');
export const buttonArea = document.querySelector('.row-title-area');
export const buttonCount = document.querySelector('.row-title-count');
export const buttonAbs = document.querySelector('.row-title-abs');
export const textarea = document.querySelector('#list__search');
export const searchInput = document.querySelector('#list__search');
export const indicator = document.querySelector('#list__indicator');
export const listContainer = document.querySelector('.list__container');
export const keyboardButton = document.querySelector('.keyboard-button');
export const loading = document.querySelector('.loading');
export const contentTop = document.querySelector('.content-top');
export const resizeBtns = document.querySelectorAll('.max-min-btn');
export const themeSwitch = document.querySelector('#checkbox');
export const graphMessageEl = document.querySelector('.graph-message');
export const graphTimeframeSelect = document.querySelector('#timeframe');
export const lastUpdateTimeEl = document.querySelector('.day-updated');
export const tableDivs = {
  confirmed: document.querySelector('.cases-confirmed'),
  recovered: document.querySelector('.cases-recovered'),
  deaths: document.querySelector('.cases-deaths'),
  totalOrNew: document.querySelector('.total-or-new'),
};

export const getListRows = () => listContainer.querySelectorAll('.list__row');
export const getActiveListRow = () => listContainer.querySelector('.list__row_active');
