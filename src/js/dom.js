export const canvasEl = document.querySelector('#chart');
export const divDeaths = document.querySelector('.cases-deaths');
export const divRecovered = document.querySelector('.cases-recovered');
export const divCases = document.querySelector('.cases-confirmed');
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

export const getListRows = () => listContainer.querySelectorAll('.list__row');
export const getActiveListRow = () => listContainer.querySelector('.list__row_active');
