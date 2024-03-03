# Setup

This guide will be for users who want to run this bot locally.

As this bot is in WIP, the setup process is not yet fully documented. However, as this bot progresses, this guide will be updated. For now, this guide will only contain the basic setup process for a DEVELOPMENT environment.

## Before you start...

Familiarity with monorepo projects, Docker, TypeScript and Node.js is recommended.

## 1. Prerequisites (software)

In order for this bot to run locally, you will need to have the following software installed:

- Git (a given)
- Node.js v20 or later with npm version 9 or later
- Docker and Docker Compose (for local database and keydb services)
- (optional) Ngrok for OAuth2 callback URL testing. If you are not using Ngrok, you may be able to use something else
- And all the other tools you probably already have installed!

## 2. Install

1. Clone this repository to your local machine.
2. Run `npm install` in the root of the repository to install all the dependencies.

## 3. Configure

In the root of this repo is a file called ".envexample", this file contains a template for the environment variables that the bot needs to run. Unfortunately, there's a few, and this file is subject to change.

Copy and rename this file to ".env" and fill in the values. The applications in this project will verify at launch that all the required environment variables are set either via this file or on the system itself. If one is missing or invalid, the application will not start and will tell you which one(s) are missing.

> Important! Do not EVER leak your .env file to the public. This file contains secrets and sensitive information that can be used to compromise your bot and your users.

## 4. Build and run

1. Run `docker-compose up` to launch the database and keydb services.
2. Run `npm run dev` to start all services in parallel in development mode.
