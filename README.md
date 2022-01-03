# rubbish-scheduler

A small Node app to add the waste data collection details to my calendar. I created this because Bromley Council kept arbitrarily changes the dates without informing the residents.

## How it works

Using Puppeteer, I scrap the data I need from the Bromley Council website. Then, I format the waste collection data according to the contract of the Google Calendar API and add them as events to my Calendar.

A cron job runs this once a day using Github Actions to keep everything updated. Any events added in future dates are deleted before inserting the new ones.

## Tech Used

- Node
- Puppeteer
- Google Calendar API
- Vercel
- GitHub Actions
