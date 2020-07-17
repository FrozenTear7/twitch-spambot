import dotenv from 'dotenv'
import tmi from 'tmi.js'

dotenv.config({ silent: true })

const opts = {
  identity: {
    username: process.env.CHANNEL_NAME,
    password: process.env.CLIENT_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
}

const client = new tmi.client(opts)

client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

client.connect()

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim()

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice()
    client.say(target, `You rolled a ${num}`)
    console.log(`* Executed ${commandName} command`)
  } else {
    console.log(`* Unknown command ${commandName}`)
  }
}

function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}
