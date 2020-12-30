# twitch-spambot

### An automated twitch spammer

## Idea

The idea of this small project is to process the messages from given channel
and simply spam whichever phrase is currently the most popular.

We can achieve this by constantly monitoring the chat with IRC from Twitch's
Node.js library [tmi.js](https://github.com/tmijs).

We also fetch sub emotes from that channel to reject messages containing them,
if we're not subbed.

## How to run the program

[_Node.js_](https://nodejs.org/) is required, the program was created with _v14.4.0_.

```bash
npm install

npm start <channelName>

or

npm start <channelName> 3000 30000 5
```

The program has 4 available arguments:

- **channelName** (required) - channel to which we connect to
- **readInterval**: default = 5000 _ms_ - the amount of time during which we gather channel messages and try to find the most popular spam
- **sleepInterval**: default = 30000 _ms_ - duration of sleep after sending the message to the channel
- **scoreThreshold**: default = 4 - score required for the most popular message to be sent
- **mentionResponse**: default = 1 (0 to disable the auto response, 1 to enable), when enabled results in an auto response (response takes randomly from 2 to 4s) to the person who mentioned your nickname in their message, with: _@username [ConcernDoge](https://betterttv.com/emotes/566c9f6365dbbdab32ec0532) 👌_ (if you don't like it just change it in the `index.js` file in the `onMessageHandler` function)

The arguments are passed as:

```bash
npm start <channelName> <readInterval> <sleepInterval> <scoreThreshold> <mentionResponse>
```

If you wish to omit a particular argument (except the `channelName`), just pass a Javascript _falsy_ value,
or an argument that is not a number, for example:

```bash
npm start <channelName> - - 5 -
```

which will result in running the script with default values for `readInterval`, `sleepInterval` and `mentionResponse`, but will change the default value of `scoreThreshold` from 4 to 5.

You can also just run:

```bash
npm start <channelName>
```

to run the program with the default arguments.
Adjust the arguments to match the desired channel's chat speed and activity.

You can also run multiple instances of the script at once by joining `npm start <channelName>` commands with `&` like:

```bash
npm start <channelName> & npm start <channelName2> & npm start <channelName3>
```

_.env_ file is also required to provide data for the api and the config.
Create an _.env_ file consiting of values as shown below:

```bash
TWITCH_USERNAME=<twitch_username>
CLIENT_TOKEN=<client_token>
```

Client token can be retrieved from [here](https://twitchapps.com/tmi/).

## Additional ignored words

You can add additional words to ignore (they will count towards message score, but will not be sent if they end up with the highest score).
I found that feature useful since you might want to censor some words yourself.

My example cases were:

- a streamer got banned, but people could still use his emotes, while they could not be fetched from the api
- a 3rd party chat app (such as Chatterino for example), allows to easily whisper people without using the `@` character before their username, which is hard to filter out - constantly keeping the user list cached would take a lot of resources and requests in bigger chats, so you might want to ignore usernames that are often whispered to avoid unintentional pings

To use this feature edit the json file called `ignoredWords.json` in the `utils` directory of the project, with structure as shown below:

```javascript
{
  "ignoredWords": ["forsen1", "forsen2", "forsen3"] // 3 example words to ignore
}
```

with an array of ignored words of your choice.

## Whitelist sub emotes

If you're subscired to a streamer and want to user their emotes with this bot, add their channel ID to `whitelistEmotes.json` file in the `utils` directory.

Since it would be troublesome for many people to create their own credentials for Twitch API requests you have to add the ID instead of the channel to simplify the process.

At the moment being one example website that allows finding channel IDs by providing usernames can be found [here](https://staging.streamweasels.com/support/convert-twitch-username-to-user-id/).
After getting the channel ID paste it in as:

```javascript
{
  "channels": ["62300805"] // Example channel ID for NymN's channel
}
```

Otherwise just leave the `channels` entry as an empty array.
