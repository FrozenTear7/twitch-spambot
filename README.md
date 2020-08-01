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

_Node.js_ is required, the program was created with _v14.4.0_.

```bash
npm install

npm start

or

npm start 3000 30000 5
```

The program has 4 available arguments:

- channelName (required)
- readInterval: default = 5000 _ms_
- sleepInterval: default = 30000 _ms_
- repetitionThreshold: default = 4

The arguments are passed as:

```bash
npm start <channelName> <readInterval> <sleepInterval> <repetitionThreshold>
```

If you wish to omit a particular argument, just pass a Javascript _falsy_ value,
or an argument that is not a number.
You can also just run:

```
npm start <channelName>
```

to run the program with the default arguments.
Adjust the arguments to match the desired channel's chat speed and activity.

_.env_ file is also required to provide data for the api and the config.
Create an _.env_ file consiting of values as shown below:

```bash
TWITCH_USERNAME=<twitch_username>
CLIENT_TOKEN=<client_token>
CHANNEL_IDS=<channel_id>(,<channel_id2>,<channel_id3>) # pass more channels to ignore after ','
```

To get Client ID and secret, you have to create an application
on the Twitch Developer site.
Client token can be retrieved from https://twitchapps.com/tmi/.

CHANNEL_IDS is a string of channels, from which sub emotes should be ignored,
for example if you're not a subscriber it would be wise to add the channel to
ignores, as usually it will be a popular spam in this particular channel.

Sometimes subscribers of other channels can start massively spamming that streamer's
emotes, which may result in the bot posting it in the chat, so consider
other channels as possibilites too.
(I myself usually ignore about 4 main channels)

To get Channel ID, you have to make a request to _https://api.twitch.tv/kraken/users?login=channel_name_ with Headers:

- Client-ID: <client_id>
- Accept: application/vnd.twitchtv.v5+json
