const Discord = require("discord.js");
const client = require('../index.js').client;
const player = require('../index.js').player;
client.player = player;

module.exports = {
    execute: async (message) => {
        const queue = client.player.getQueue(message);
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Requested by ${queue.tracks[queue.tracks.length - 1].requestedBy.username}`)
        .setColor("RANDOM")
        .setTitle("Added to the queue...\n")
        .setDescription(`**${queue.tracks[queue.tracks.length - 1].title}**\n${queue.tracks[queue.tracks.length - 1].url}`)
        message.channel.send(embed);
    },
};