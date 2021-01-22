const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YTAPI);

module.exports = {
    name: "play",
    execute: async (message, args, client) => {

        message.guild.me.voice.setSelfDeaf(true);

        if (message.channel.type == 'dm') return message.channel.send("❌ Music functions are not available in DM");

        if (!args[0]) return message.channel.send(`<@${message.author.id}> Usage: \`mk!play [URL / Search query]\``);
        
        if (!message.member.voice.channel) return message.channel.send(`<@${message.author.id}> ❌ You need to be in a voice channel`);
        
        if (!message.guild.me.hasPermission('CONNECT')) return message.channel.send("❌ I don't have enough permissions to join the voice channel");
        if (!message.guild.me.hasPermission('SPEAK')) return message.channel.send("❌ I don't have enough permissions to speak in the voice channel");

        switch(ytdl.validateURL(args[0])) {
            case true:
                client.player.play(message, args[0], message.member.user);
            break;

            case false:
                let results = await youtube.searchVideos(args.join(' '), 1);
                results.map((video => client.player.play(message, video.url, message.member.user)));
            break;
        }

    },
};