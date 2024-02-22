# Djs Osu! Bot

_NOTE: This bot is still in development and is not yet ready for use._

An open-source Discord bot that provides Osu! related commands and features.

Its highlight feature is the ability to upload replay files and have the bot render them as mp4 files.

## Features being worked on!

-   User profiles fetch
-   Upload replay files and have the bot render them as mp4 (very rough at the moment, but works!)
-   Generate a beatmap play report image using the replay file

Again, all WIP!

## How it works

When you get an epic play on Osu!, gone are the days of having to use a third-party screen recording software to capture your replay.
With this bot, you can upload your replay file as an attachment through a Discord message.
The bot will then process your replay file and render it as an mp4 file, which you can then download and share with your friends.

This bot does not use o!rdr, as great as that tool is, it runs its own worker queue system for rendering replays. It doesn't re-invent the whole wheel though, as this bot still uses Danser CLI, the same tooling that powers o!rdr. This means that the bot is in full control of the rendering process and can provide a better user experience. If you run this bot yourself, you can fully customise the rendering process to your liking. 4k high-bitrate replays? No problem.

## Paid?

To keep things simple, I will eventually provide a hosted version of this bot for free, with some limitations of course to keep my personal costs down. If you want to run your own instance of this bot, you can do so, and I will provide a guide on how to do so but for those that just want to use the bot, there will be one online for you to use without hassle.

At some point I will configure Stripe to allow for donations to keep the bot running, but I will never charge for the bot's core features, you will just get some extra perks like higher quality replays and priority in the rendering queue. But I am still undecided.

## Technologies this bot uses (or will soon use)

-   TypeScript using an NX managed monorepo
-   Danser CLI for replay rendering (this bot will NOT use o!rdr, it will manage its own worker queue system for rendering replays)
-   Discord.js, with (bot sharding for large servers will be implemented in the future)
-   Fastify for the API server
-   MongoDB
-   KeyDB with BullMQ for queueing replay jobs for rendering
-   Docker
-   Kubernetes (not implemented, will be used in the future for deployment)
-   S3 for storing rendered replays and other user files

## Installation

Will be provided in the future.
