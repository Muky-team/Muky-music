const Discord = require('discord.js');
const fs = require("fs");
const prefix = 'mk!';
const { Player, Track } = require("discord-player");
require("dotenv").config();

const enmap = require("enmap");

const settings = new enmap({
  name: "settings",
  autoFetch: true,
  cloneLevel: "deep",
  fetchAll: true
});

exports.settings = settings;

const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

exports.client = client;

client.once('ready', () => {
  console.log("Muky Music is now ON");
  client.user.setPresence({ activity: { name: 'mk!help | v1.0.0' }, status: 'online' })
  .catch(console.error);
});
client.login(process.env.TOKEN);


for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if(!command) return message.channel.send("❌ Unknown command, for a list of commands use `mk!help`");

  try{
    command.execute(message, args, client);
  } catch (err) {
    console.log(err);
    message.reply("❌ An error ocurred while trying to run that command.");
  }

});

const player = new Player(client);
client.player = player;

exports.player = player;

client.player.on('trackAdd', async (message, track) => {
  require("./events/trackAdd").execute(message, track);
});

client.player.on('trackStart', async (message, track) => {
  require("./events/trackStart").execute(message, track);
});

