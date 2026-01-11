const dayjs = require('dayjs');

const { DATETIME_OPTIONS, USER_PREFERENCES } = require('../config');

const createCalendarEvents = (wasteCollectionsData = []) => {
  const mergedCollectionsOfSameDay = wasteCollectionsData.reduce((acc, collection) => {
    const collectionDayAddedIndex = acc.findIndex((c) => c.nextCollectionDate === collection.nextCollectionDate);

    if (collectionDayAddedIndex > -1) {
      acc[collectionDayAddedIndex].title = `${acc[collectionDayAddedIndex].title} & ${collection.title}`;
      return acc;
    }

    return [...acc, collection];
  }, []);

  const calendarEvents = mergedCollectionsOfSameDay.map((collection) => {
    const eventStartTime = dayjs(collection.nextCollectionDate)
      .hour(DATETIME_OPTIONS.EVENT_START_TIME)
      .format(DATETIME_OPTIONS.FORMAT);
    const eventEndTime = dayjs(collection.nextCollectionDate)
      .hour(DATETIME_OPTIONS.EVENT_END_TIME)
      .format(DATETIME_OPTIONS.FORMAT);

    return {
      colorId: USER_PREFERENCES.GOOGLE_CALENDAR_EVENT_COLOUR_ID,
      description: `Waste collection of ${collection.title}`,
      end: {
        dateTime: eventEndTime,
        timeZone: USER_PREFERENCES.TIMEZONE,
      },
      location: USER_PREFERENCES.LOCATION,
      start: {
        dateTime: eventStartTime,
        timeZone: USER_PREFERENCES.TIMEZONE,
      },
      summary: collection.title,
    };
  });

  const sortedCalendarEvents = calendarEvents.sort((a, b) => {
    if (a.start.dateTime > b.start.dateTime) return 1;
    if (a.start.dateTime < b.start.dateTime) return -1;
    return 0;
  });

  return sortedCalendarEvents;
};

module.exports = createCalendarEvents;
