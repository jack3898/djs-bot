# Ohss bot

> "It's pronounced 'ohss' not 'oh-su'!!" - Some Osu! person, probably.

_NOTE: This bot is still in development and is not yet ready for use. It's being developed by a single person, and the scope is huge! So it may take a while!_

An open-source Discord bot that provides Osu! related commands and features.

Its highlight feature is the ability to upload replay files and have the bot render them as mp4 files.

## Features being worked on!

- Modern website to view your replays
- Upload replay files and have the bot render them as mp4. This functionality is already implemented and working, but it just needs a bit of polishing
- A Discord bot to initiate the rendering process.

## How it works

When you get an epic play on Osu!, gone are the days of having to use a third-party screen recording software to capture your replay.
With this bot, you can upload your replay file as an attachment through a Discord message.
The bot will then process your replay file and render it as an mp4 file, which you can then download and share with your friends.

This bot does not use o!rdr, as great as that tool is, it runs its own worker queue system for rendering replays. It doesn't re-invent the whole wheel though, as this bot still uses Danser CLI, the same tooling that powers o!rdr. This means that the bot is in full control of the rendering process and we are not beholden to the limitations of o!rdr's API.

Crowd-sourced replay rendering is also a feature that I will look to implement in the future.

## Paid?

Here's how I plan to run this bot:

- The bot will be free to use, but there will be a rate limit.
- There will be a paid tier that relaxes this limit and provides some extra perks.
- The bot will be funded by donations and the paid tier.
- The bot will respect user privacy and will not sell user data or be ad-supported.

## Technologies this bot uses (or will soon use) for those that are interested!

I like to be transparent about the technologies I use so you know what you're getting into if you want to self-host this bot as well as how your data is being handled if you're using the bot!

- TypeScript using an NX managed monorepo
- Danser CLI for replay rendering
- Discord.js, with (bot sharding for large servers will be implemented in the future)
- Fastify for the REST API server and to serve static website assets
- React and Tailwind for the website
- MongoDB for general DB storage
- KeyDB with BullMQ for queueing replay jobs for rendering
- Docker
- Kubernetes
- Linode for hosting the k8s cluster and object storage
- GitHub Actions for CI/CD
- Beatconnect, an Osu! beatmap mirror for fetching beatmap files
- S3 for storing rendered replays and other user files
- Osu! and Discord OAuth2 for user authentication

## Installation

Please see SETUP.md for instructions on how to set up your own instance of this bot.

# What about the future?

From this point on will be my thoughts on what I want to do with this bot in the future. Some may not be implemented, but it can give you an idea of how I vision this bot to be.

## Features after MVP

This is the list of features that I will work on after the bot is in a stable state and deployed! The MVP is just a POC of the replay rendering feature and the website.

- Donation system via Stripe/Patreon/Ko-fi to keep the bot running and provide some extra perks to users
- Osu! user profiles fetch
- Customisable replay rendering settings per user (skins, resolution, etc)
- Perks for donating, like 4k replays.

## Features if this project gets somewhere good!

This is the list of features that I hope to work on if this project gets a lot of traction and becomes somewhat profitable.

- Crowd-sourced replay rendering; allowing users to install their own worker and contribute to the rendering queue and reap rewards
- YouTube integration; allowing users to auto-upload their replays to YouTube with a custom title and description template customisable via the website. Super handy for users with poor internet connectivity or a slower PC as your video replay doesn't need to touch your computer. Uploading your replays will be as easy as:
  1. `/render` command via the Discord bot
  2. Wait for the bot to do its magic
  3. Done! It's on your YouTube channel!
- Allow users to setup custom cloud storage for replays (more for advanced users).
- Encryption of all data; the cloud storage currently used is Linode Object Storage, which is not encrypted by default. Considering the data there isn't personally identifiable (it's only gameplay videos and replays) I have not yet implemented encryption, but it's a nice thing to have.
