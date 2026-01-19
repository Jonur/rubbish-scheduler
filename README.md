# rubbish-scheduler

A small Node.js service that automatically keeps my Google Calendar in sync with my local council’s waste collection schedule.

I built this because Bromley Council frequently changes collection dates without notifying residents, which makes recurring reminders unreliable.

This service runs once per day and ensures my calendar always reflects the current official schedule.

## What it does

- Scrapes waste collection dates from the Bromley Council website
- Parses and normalises the collection dates
- Creates Google Calendar events for upcoming collections
- Deletes any existing future waste-collection events before inserting new ones (to avoid duplicates)
- Runs automatically once per day via a cron job

## How it works (high level)

### 1. Scraping

- Uses Puppeteer (headless Chromium) to load the council website
- Extracts waste types and collection date text
- Parses dates in a tolerant way (handles whitespace, ordinal dates like `3rd`, missing years, etc.)

### 2. Calendar sync

- Authenticates using a Google Service Account
- Lists existing calendar events in a defined time window
- Deletes existing waste-collection events
- Inserts the newly generated events

### 3. Scheduling

- Exposed as a Vercel Serverless Function (`/api/waste-collection`)
- Triggered once per day using Vercel Cron
- Protected using a shared secret (`CRON_SECRET`) so it cannot be triggered publicly

## Running locally

Please use Node v24.

### Environment variables

```bash

# JSON string of a Google service account key (with escaped \n newlines)
SERVICE_ACCOUNT_KEY = {}

# The Google Calendar ID to write to
GOOGLE_CALENDAR_ID="{{id}}@group.calendar.google.com"

# User address
USER_LOCATION="Street, Postcode"

# House details on the council's website
SOURCE_WEBSITE="https://recyclingservices.bromley.gov.uk/waste/{{id}}"

# Shared secret used to secure the cron endpoint
CRON_SECRET="secret"
```

### Commands

```bash
# install dependencies
npm install

# start the app locally
npm run start:local

# OR start the app locally with mock data skipping scraping
npm run start:local:mock

# lint
npm run lint

# typecheck
npm run typecheck
```

## Tech stack

- Node.js
- Puppeteer (headless Chromium scraping)
- Google Calendar API (via googleapis)
- Vercel (serverless functions + cron)
- Day.js (date parsing & timezone handling)

## Cron behaviour (Vercel)

- The cron job is defined in vercel.json
- Runs once per day (UTC)
- Vercel automatically sends the Authorization: Bearer <CRON_SECRET> header
- Logs and failures are visible in the Vercel dashboard

## Common failure modes & fixes

### Puppeteer fails / returns no data

- The council website structure may have changed
- Check selectors and update parsing logic
- Enable Puppeteer debug logging and/or screenshots

### Google Calendar auth errors

- Ensure SERVICE_ACCOUNT_KEY newlines are correctly restored (\\n → \n)
- Ensure the calendar is shared with the service account email

### Duplicate events

- Usually indicates that listing or deleting existing events failed
- Check date range logic and timezone handling

## Why this exists

This is intentionally small, boring, and reliable.

It’s not a general-purpose library — it’s a personal automation that:

- runs once per day,
- does one job,
- and quietly keeps my calendar accurate.
