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

npm start <channelName>

or

npm start <channelName> 3000 30000 5
```

The program has 4 available arguments:

- channelName (required)
- readInterval: default = 5000 _ms_
- sleepInterval: default = 30000 _ms_
- scoreThreshold: default = 4

The arguments are passed as:

```bash
npm start <channelName> <readInterval> <sleepInterval> <scoreThreshold>
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
```

Client token can be retrieved from https://twitchapps.com/tmi/.

## Additional ignored words

You can add additional words to ignore (they will count towards message score, but will not be sent if they end up with the highest score).
I found that feature useful since you might want to censor some words yourself.

My example cases were:

- a streamer got banned, but people could still use his emotes, while they could not be fetched from the api
- a 3rd party chat app (such as Chatterino for example), allows to easily whisper people without using the `@` character before their username, which is hard to filter out - constantly keeping the user list cached would take a lot of resources and requests in bigger chats, so you might want to ignore usernames that are often whispered to avoid unintentional pings

To use this feature edit the json file called `ignoredWords.json` in the `utils` directory of the project, with structure as shown below:

```json
{
  "ignoredWords": ["forsen1", "forsen2", "forsen3"] // 3 example words to ignore
}
```

with an array of ignored words of your choice.
