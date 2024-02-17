# Djs Osu! Bot

_NOTE: This bot is still in development and is not yet ready for use._

An open-source Discord bot that provides Osu! related commands and features. It's highly ambitious, so forgive me if I never complete it!

## Features being worked on!

- User profiles fetch
- Upload replay files and have the bot render them as mp4 (very rough at the moment, but works!)
  - You will be able to render 4k replays if you host this bot yourself 👀
- Generate a beatmap play report image using the replay file

The above features are not yet implemented and are being worked on, and are subject to change. The MVP will be those above features! And I will be sure to update this list as I go.

## Technologies this bot uses (or will soon use)

- TypeScript using an NX managed monorepo
- Danser CLI for replay rendering (this bot will NOT use o!rdr, it will manage its own worker queue system for rendering replays)
- Discord.js, with (bot sharding for large servers will be implemented in the future)
- Fastify for the API server
- MongoDB
- KeyDB with Redis tooling for queueing replay jobs for rendering
- Docker
- Kubernetes (not implemented, will be used in the future for deployment)
- Google API (not implemented, to upload the rendered replays to your own Google Drive using OAuth2)

## Installation

1. Clone the repository
2. Install Node.js v20 or higher
3. Install the required dependencies using `npm install`
4. Copy the `.envexample` file to `.env` and fill in the required fields. Some fields have default values you can use.
   1. You will need to create a bot on the Discord Developer Portal and get the bot token
5. Run `docker-compose up` to start the database and queue server
6. Run the bot using `npm run dev` (prod mode is in the works), this will start the bot and connect to the database and queue server
7. Invite the bot to your server using the OAuth2 link generated in the Discord Developer Portal
8. Enjoy!
