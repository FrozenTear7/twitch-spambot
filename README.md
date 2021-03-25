# twitch-spambot

[![CI](https://github.com/FrozenTear7/twitch-spambot/actions/workflows/CI.yml/badge.svg?branch=master)](https://github.com/FrozenTear7/twitch-spambot/actions/workflows/CI.yml)

![Coverage - statements](./badges/badge-statements.svg)
![Coverage - branches](./badges/badge-branches.svg)
![Coverage - functions](./badges/badge-functions.svg)
![Coverage - lines](./badges/badge-lines.svg)

[![Releases downloads](https://img.shields.io/github/downloads/FrozenTear7/twitch-spambot/total)](https://github.com/FrozenTear7/twitch-spambot/releases)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/FrozenTear7/twitch-spambot)](https://github.com/FrozenTear7/twitch-spambot/releases)
[![GitHub Release Date](https://img.shields.io/github/release-date/FrozenTear7/twitch-spambot)](https://github.com/FrozenTear7/twitch-spambot/releases)
[![License](https://img.shields.io/github/license/FrozenTear7/twitch-spambot)](https://github.com/FrozenTear7/twitch-spambot/blob/master/LICENSE)
[![GitHub open issues](https://img.shields.io/github/issues-raw/FrozenTear7/twitch-spambot)](https://github.com/FrozenTear7/twitch-spambot/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/FrozenTear7/twitch-spambot)](https://github.com/FrozenTear7/twitch-spambot/issues?q=is%3Aissue+is%3Aclosed)

### An automated twitch spammer

## Idea

The idea of this small project is to process the messages from given channel
and simply spam whichever phrase is currently the most popular.

We can achieve this by constantly monitoring the chat with IRC from Twitch's
Node.js library [tmi.js](https://github.com/tmijs).

We also fetch sub emotes from that channel to reject messages containing them,
if we're not subbed.

## How to run the program

[**Node.js**](https://nodejs.org/) is required, the program works under _Windows_, _Ubuntu_ and _macOS_, with Node _v14_ and _v14_.

_.env_ file is required to provide data for the api and the config.
Create an _.env_ file consiting of values as shown below:

```bash
TWITCH_USERNAME=YourUsername
CLIENT_TOKEN=oauth:YourOAuthCodeGoesHere
```

Client token can be retrieved from [here](https://twitchapps.com/tmi/).

### Release version

If you're running a release downloaded from the [releases page](https://github.com/FrozenTear7/twitch-spambot/releases):

```bash
yarn install --production

yarn start CHANNEL_NAME
# or
yarn start CHANNEL_NAME 3000 30000 5
```

### Master version

Otherwise if you're running the current master build:

```bash
yarn install
```

and then:

- if you want to edit the code and made your own changes, run the TypeScript version

```bash
yarn run dev CHANNEL_NAME
# or
yarn run dev CHANNEL_NAME 3000 30000 5
```

- if you want to compile the TypeScript to pure JavaScript

```bash
yarn run tsc # to make a build directory

yarn start:dev CHANNEL_NAME
# or
yarn start:dev CHANNEL_NAME 3000 30000 5
```

The program has 4 available arguments:

- **channelName** (required) - channel to which we connect to
- **readInterval**: default = 5000 _ms_ - the amount of time during which we gather channel messages and try to find the most popular spam
- **sleepInterval**: default = 30000 _ms_ - duration of sleep after sending the message to the channel
- **messageScore**: default = 5 - score required for the most popular message to be sent (every message read within readInterval can contribute from 0 to 1 to the score and in case messages are the same, 2 will be added instead)
- **mentionResponse**: when provided, results in an auto response (response takes randomly from 2 to 4s) to the person who mentioned your nickname in their message

The arguments are passed as:

```bash
yarn start CHANNEL_NAME READ_INTERVAL SLEEP_INTERVAL MESSAGE_SCORE MENTION_RESPONSE
```

If you wish to omit a particular argument (except the `channelName`), just pass a JavaScript _falsy_ value,
or an argument that is not a number, for example:

```bash
yarn start CHANNEL_NAME - - 6 -
```

which will result in running the script with default values for `readInterval`, `sleepInterval` and `mentionResponse`, but will change the default value of `messageScore` from 5 to 6.

You can also just run:

```bash
yarn start CHANNEL_NAME
```

to run the program with the default arguments.
Adjust the arguments to match the desired channel's chat speed and activity.

You can also run multiple instances of the script at once by joining `yarn start CHANNEL_NAME` commands with `&` like:

```bash
yarn start CHANNEL_NAME & yarn start CHANNEL_NAME2 & yarn start CHANNEL_NAME3
```

## Additional ignored words

You can add additional words to ignore (they will count towards message score, but will not be sent if they end up with the highest score).
I found that feature useful since you might want to censor some words yourself.

My example cases were:

- a streamer got banned, but people could still use his emotes, while they could not be fetched from the api
- a 3rd party chat app (such as Chatterino for example), allows to easily whisper people without using the `@` character before their username, which is hard to filter out - constantly keeping the user list cached would take a lot of resources and requests in bigger chats, so you might want to ignore usernames that are often whispered to avoid unintentional pings

To use this feature edit the json file called `ignoredWords.json` in the `src/utils` directory of the project, with structure as shown below:

```javascript
{
  "ignoredWords": ["forsen1", "forsen2", "forsen3"] // 3 example words to ignore
}
```

with an array of ignored words of your choice.

## Whitelist sub emotes

If you're subscired to a streamer and want to user their emotes with this bot, add their channel ID to `whitelistEmotes.json` file in the `src/utils` directory.

Since it would be troublesome for many people to create their own credentials for Twitch API requests you have to add the ID instead of the channel to simplify the process.

At the moment being one example website that allows finding channel IDs by providing usernames can be found [here](https://staging.streamweasels.com/support/convert-twitch-username-to-user-id/).
After getting the channel ID paste it in as:

```javascript
{
  "channels": ["62300805"] // Example channel ID for NymN's channel
}
```

Otherwise just leave the `channels` entry as an empty array.

## Known problems

1. yarn.ps1 cannot be loaded because running scripts is disabled on this system

Error on Windows that doesn't allow the user to install the libraries with yarn:

Open up `Windows PowerShell` and in the terminal type:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
```

After that, yarn should properly install dependencies.

## Contributing

Please review the [contributing guidelines](https://github.com/FrozenTear7/twitch-spambot/blob/master/CONTRIBUTING.md). We reserve the right to refuse a Pull Request if it does not meet the requirements.
