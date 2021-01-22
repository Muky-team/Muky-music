const Discord = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['commands', 'command-list', 'commands-list'],
    execute: async (message, args) => {
        if(!args[0]) {
        
        const embed = new Discord.MessageEmbed()
        .setTitle("Commands")
        .setColor("#c68cff")
        .addField("● Add a new YouTube track to the queue ●", "`mk!play [URL / Search query]`")
        .addField("● Check the queue or delete a track from it ●", "`mk!queue [delete*] [Track number*]`")
        .setFooter("* Optional");
        if (message.channel.type != 'dm') message.react('783522050681470986');
        message.author.send(embed);
        }
        
    }
}