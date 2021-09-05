const dayjs = require('dayjs');
const { MONTHS } = require('../../constants');

const currentYear = dayjs().year();

const getNextCollectionDate = (nextCollection) => {
  const nextCollectionDay = +(nextCollection.match(/\d/g) || []).join('');
  const nextCollectionMonth = (nextCollection.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)/g
  ) || [])[0];

  const isValidDay =
    !!nextCollectionMonth &&
    nextCollectionDay >= 1 &&
    nextCollectionDay <= 31 &&
    !(nextCollectionMonth === 'February' && nextCollectionDay > 29);

  const currentMonth = MONTHS.indexOf(dayjs().locale('en').format('MMMM'));
  const resultMonth = MONTHS.indexOf(nextCollectionMonth);
  const isNextYear = resultMonth < currentMonth;
  const nextCollectionYear = isNextYear ? currentYear + 1 : currentYear;

  return isValidDay ? `${nextCollectionDay} ${nextCollectionMonth} ${nextCollectionYear}` : '';
};

module.exports = getNextCollectionDate;
