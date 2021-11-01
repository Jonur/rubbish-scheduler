const puppeteerResponseMock = [
  {
    title: 'Food Waste',
    nextCollectionDate: '4 November 2021',
  },
  {
    title: 'Paper & Cardboard',
    nextCollectionDate: '4 November 2021',
  },
  {
    title: 'Non-Recyclable Refuse',
    nextCollectionDate: '4 November 2021',
  },
  {
    title: 'Garden Waste',
    nextCollectionDate: '8 November 2021',
  },
  {
    title: 'Mixed Recycling (Cans, Plastics & Glass)',
    nextCollectionDate: '11 November 2021',
  },
];

const existingCalendarEventsMock = {
  data: {
    items: [
      {
        kind: 'calendar#event',
        etag: '"3261683699128000"',
        id: 'hnochcv0r5tjen2kubo085tv64',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=aG5vY2hjdjByNXRqZW4ya3VibzA4NXR2NjQgajVubTl1dTR0c2FiY2JkbzY5aXRxdHYzYW9AZw&ctz=Europe/London',
        created: '2021-09-05T11:37:29.000Z',
        updated: '2021-09-05T11:37:29.564Z',
        summary: 'Food Waste & Paper & Cardboard & Non-Recyclable Refuse',
        description: 'Waste collection of Food Waste & Paper & Cardboard & Non-Recyclable Refuse',
        location: '17 Quernmore Cl, Bromley BR1 4EL',
        colorId: '5',
        creator: { email: 'd.k.damilos@gmail.com' },
        organizer: {
          email: 'j5nm9uu4tsabcbdo69itqtv3ao@group.calendar.google.com',
          displayName: 'House Events',
          self: true,
        },
        start: { dateTime: '2021-09-09T08:00:00+01:00', timeZone: 'Europe/London' },
        end: { dateTime: '2021-09-09T10:00:00+01:00', timeZone: 'Europe/London' },
        iCalUID: 'hnochcv0r5tjen2kubo085tv64@google.com',
        sequence: 0,
        reminders: { useDefault: true },
        eventType: 'default',
      },
      {
        kind: 'calendar#event',
        etag: '"3261683699314000"',
        id: '4q5koicqbbmjathne6nof7qu14',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=NHE1a29pY3FiYm1qYXRobmU2bm9mN3F1MTQgajVubTl1dTR0c2FiY2JkbzY5aXRxdHYzYW9AZw&ctz=Europe/London',
        created: '2021-09-05T11:37:29.000Z',
        updated: '2021-09-05T11:37:29.657Z',
        summary: 'Garden Waste',
        description: 'Waste collection of Garden Waste',
        location: '17 Quernmore Cl, Bromley BR1 4EL',
        colorId: '5',
        creator: { email: 'd.k.damilos@gmail.com' },
        organizer: {
          email: 'j5nm9uu4tsabcbdo69itqtv3ao@group.calendar.google.com',
          displayName: 'House Events',
          self: true,
        },
        start: { dateTime: '2021-09-13T08:00:00+01:00', timeZone: 'Europe/London' },
        end: { dateTime: '2021-09-13T10:00:00+01:00', timeZone: 'Europe/London' },
        iCalUID: '4q5koicqbbmjathne6nof7qu14@google.com',
        sequence: 0,
        reminders: { useDefault: true },
        eventType: 'default',
      },
      {
        kind: 'calendar#event',
        etag: '"3261683699720000"',
        id: 'bb9gtktp046g9hsq0j6lojk6pc',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=YmI5Z3RrdHAwNDZnOWhzcTBqNmxvams2cGMgajVubTl1dTR0c2FiY2JkbzY5aXRxdHYzYW9AZw&ctz=Europe/London',
        created: '2021-09-05T11:37:29.000Z',
        updated: '2021-09-05T11:37:29.860Z',
        summary: 'Mixed Recycling (Cans, Plastics & Glass)',
        description: 'Waste collection of Mixed Recycling (Cans, Plastics & Glass)',
        location: '17 Quernmore Cl, Bromley BR1 4EL',
        colorId: '5',
        creator: { email: 'd.k.damilos@gmail.com' },
        organizer: {
          email: 'j5nm9uu4tsabcbdo69itqtv3ao@group.calendar.google.com',
          displayName: 'House Events',
          self: true,
        },
        start: { dateTime: '2021-09-16T08:00:00+01:00', timeZone: 'Europe/London' },
        end: { dateTime: '2021-09-16T10:00:00+01:00', timeZone: 'Europe/London' },
        iCalUID: 'bb9gtktp046g9hsq0j6lojk6pc@google.com',
        sequence: 0,
        reminders: { useDefault: true },
        eventType: 'default',
      },
    ],
  },
};

module.exports = {
  puppeteerResponseMock,
  existingCalendarEventsMock,
};
