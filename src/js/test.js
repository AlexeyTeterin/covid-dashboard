const isLanguageDiverse = (list) => {
  const langs = {
    Python: 0,
    Ruby: 0,
    JavaScript: 0,
  };

  list.forEach((human) => {
    const humansLang = Object.keys(langs).find((el) => el === human.language);
    if (langs[humansLang] >= 0) langs[humansLang] += 1;
  });

  const values = Object.values(langs);

  const maxHumans = Math.max(...values);
  const minHumans = Math.min(...values);

  const isDiverse = maxHumans / minHumans < 2;

  return isDiverse;
};

const list1 = [
  {
    firstName: 'Noah',
    lastName: 'M.',
    country: 'Switzerland',
    continent: 'Europe',
    age: 19,
    language: 'JavaScript',
  },
  {
    firstName: 'Maia',
    lastName: 'S.',
    country: 'Tahiti',
    continent: 'Oceania',
    age: 28,
    language: 'JavaScript',
  },
  {
    firstName: 'Shufen',
    lastName: 'L.',
    country: 'Taiwan',
    continent: 'Asia',
    age: 35,
    language: 'HTML',
  },
  {
    firstName: 'Sumayah',
    lastName: 'M.',
    country: 'Tajikistan',
    continent: 'Asia',
    age: 30,
    language: 'CSS',
  },
];

const result = isLanguageDiverse(list1);
console.log(result);
