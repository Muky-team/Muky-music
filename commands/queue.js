const Discord = require("discord.js");

module.exports = {
	name: "queue",
	execute: async (message, args, client) => {

		if (message.channel.type == 'dm') return message.channel.send("❌ Music functions are not available in DM");

		const queue = client.player.getQueue(message);

		if (args[0] && args[0].toLowerCase() == 'delete') {
			if (!args[1]) return message.channel.send(`<@${message.author.id}> Usage: \`mk!queue delete [Track number]\``)
			if (!message.member.voice.channel) return message.channel.send(`❌ <@${message.author.id}> You need to be in a voice channel`);
			if (!client.player.getQueue(message)) return message.channel.send(`❌ There isn't anything currently playing`);
			let removedTrack = queue.tracks[Math.floor(parseInt(args[1]))];
			if (!removedTrack) return message.channel.send("❌ That track does not exist")
			if (!removedTrack.requestedBy.id == message.author.id || !message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send("❌ You're not allowed to perform this action")
			client.player.remove(message, Math.floor(parseInt(args[1])));
			message.channel.send(`✅ **${removedTrack.title}** has been removed from the queue`)
		} else {

			if (!message.member.voice.channel) return message.channel.send(`<@${message.author.id}> ❌ You need to be in a voice channel`);
			if (!client.player.getQueue(message)) return message.channel.send(`❌ There isn't anything currently playing`);

			try {

				if (queue.tracks.length <= 24 && queue.tracks.length != 1) {
					const embed = new Discord.MessageEmbed();
					embed.setTitle(`${message.guild.name}`);
					embed.setColor("RANDOM");
					embed.setDescription("To delete a track from the queue use `mk!queue delete [Track number]`");
					for (i = 1; i < queue.tracks.length; i++) {
						embed.addField(`**Track ${i}:**`, `${queue.tracks[i].title} | Requested by: **${queue.tracks[i].requestedBy.username}**`);
					}
					message.channel.send(embed);
				} else if (queue.tracks.length > 24) {
					const embed = new Discord.MessageEmbed();
					embed.setTitle(`${message.guild.name}`);
					embed.setColor("RANDOM");
					embed.setDescription("To delete a track from the queue use `mk!queue delete [Track number]`");
					for (i = 0; i < 24; i++) {
						embed.addField(`**Track ${i}:**`, `${queue.tracks[i].title} - Requested by: **${queue.tracks[i].requestedBy.username}**`);
					}
					embed.setFooter(`And ${queue.tracks.length - 24} more tracks...`);
					message.channel.send(embed);
				} else {
					message.channel.send("❌ There are no tracks in queue")
				}
			} catch (err) {
				console.log(err);
				message.channel.send("❌ An error ocurred");
			}
		}
	},
};