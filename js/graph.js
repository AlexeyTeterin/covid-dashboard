import { getWorldStatsByDay } from './CovidData.js';

getWorldStatsByDay().then((DailyWorldStats) => console.log(DailyWorldStats));
