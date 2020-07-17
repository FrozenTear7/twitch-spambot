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
```

_.env_ file is also required to provide data for the api and the config.
Create an _.env_ file consiting of values as shown below:

```bash
USERNAME=<username>
CLIENT_TOKEN=<client_token>
CHANNEL_NAME=<channel_name>
CHANNEL_ID=<channel_id>
SUBMODE=false/true
```

To get Client ID and secret, you have to create an application
on the Twitch Developer site.
Client token can be retrieved from https://twitchapps.com/tmi/.

To get Channel ID, you have to make a request to _https://api.twitch.tv/kraken/users?login=forsen_ with Headers:

- Client-ID: <client_id>
- Accept: application/vnd.twitchtv.v5+json

You can also adjust the config at the top of the _index.js_ file to your liking.

Example config:

```js
const readInterval = 5000 // in [ms]
const similarityThreshold = 0.8
const repetitionThreshold = 3
```
