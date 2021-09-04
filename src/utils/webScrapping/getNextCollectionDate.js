const dayjs = require("dayjs");

const currentYear = dayjs().year();

const getNextCollectionDate = (nextCollection) => {
  const nextCollectionDay = +(nextCollection.match(/\d/g) || []).join("");
  const nextCollectionMonth = (nextCollection.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)/g
  ) || [])[0];

  const isValidDay =
    !!nextCollectionMonth &&
    nextCollectionDay >= 1 &&
    nextCollectionDay <= 31 &&
    !(nextCollectionMonth === "February" && nextCollectionDay > 29);

  return isValidDay
    ? `${nextCollectionDay} ${nextCollectionMonth} ${currentYear}`
    : "";
};

module.exports = getNextCollectionDate;
