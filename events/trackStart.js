const Discord = require("discord.js");
let player = require('../index.js').player;
let client = require('../index.js').client;

module.exports = {
	execute: async (message, track) => {
        
		const queue = client.player.getQueue(message);
		const embed = new Discord.MessageEmbed()
			.setTitle("Now playing...")
			.setColor("RANDOM")
			.setDescription(`${track.title}\n${track.url}`)
			.setImage(`${track.thumbnail}`)
			.setAuthor(`Requested by ${track.requestedBy.username}`)
			.setFooter("Please wait until all options appear on screen before selecting one");

		var messageSent = await message.channel.send(embed);
			await messageSent.react("⏯");
			await messageSent.react("⏹");
			await messageSent.react("⏭");
			await messageSent.react("🔁");
			await messageSent.react("🔀");
			await messageSent.react("🔉");
			await messageSent.react("🔊");
			await messageSent.react("🔇");

		const filter = (reaction, user) => user.id !== message.client.user.id;
		var collector = messageSent.createReactionCollector(filter, {
			time: track.durationMS
		});

		collector.on("collect", (reaction, user) => {
			if (!queue.tracks) return;
			const member = message.guild.member(user);
			
			switch (reaction.emoji.name) {

				case "⏭":
					reaction.users.remove(user).catch(console.error);

					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;
					if (!queue.tracks[1]) return message.channel.send("❌ There aren't any more songs.")

					client.player.skip(message)

					message.channel.send(`⏩ **${user.username}** has skipped **${client.player.getQueue(message).playing.title}**`);

					collector.stop();
					break;

				case "⏯":
					reaction.users.remove(user).catch(console.error);
					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;
					if (!queue.paused) {
						try {
							client.player.pause(message);
							message.channel.send(`⏸️ **${user.username}** has paused **${client.player.getQueue(message).playing.title}**`);
						} catch (err) {
							console.log(err);
							message.channel.send("❌ An error ocurred: \n" + err);
						}
					} else {
						try {
							client.player.resume(message);
							message.channel.send(`▶️ **${user.username}** has resumed **${client.player.getQueue(message).playing.title}**`);
						} catch (err) {
							console.log(err);
							message.channel.send("❌ An error ocurred: \n" + err);
						}
					}
					break;

				case "🔁":
					reaction.users.remove(user).catch(console.error);
					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;

					switch (queue.repeatMode) {
						case true:
							client.player.setRepeatMode(message, false);
							return message.channel.send(`🔁 **${user.username}** has disabled loop`);
							break;

						case false:
							client.player.setRepeatMode(message, true);
							return message.channel.send(`🔁 **${user.username}** has enabled loop`);
							break;
					}

					break;

				case "🔀":
					reaction.users.remove(user).catch(console.error);
					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;

					try {
						client.player.shuffle(message);
					} catch (err) {
						console.log(err);
					}

					message.channel.send(`🔀 **${member.guild.name}'s** queue has been shuffled`)

					break;

				case "⏹":
					reaction.users.remove(user).catch(console.error);
					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;

					try {
						client.player.setRepeatMode(message, false);
						client.player.stop(message);

						message.channel.send(`⏹️ **${user.username}** has stopped the music`);
					} catch (error) {
						console.log(error);
						message.channel.send("❌ An error ocurred: \n" + err);
					}

					collector.stop();
					break;

				case "🔉":
					reaction.users.remove(user).catch(console.error);
					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;
					if (queue.volume - 10 <= -1) return message.channel.send("❌ Cannot lower the volume any more");
					client.player.setVolume(message, queue.volume - 10);
					if (queue.volume == 0) {
						message.channel.send(`🔇 **${user.username}** muted the queue`)
							.catch(console.error);
					} else {
						message.channel.send(`🔈 **${user.username}** has decreased the volume to ${queue.volume}`)
					}
					break;

				case "🔊":
					reaction.users.remove(user).catch(console.error);
					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;
					if (queue.volume + 10 >= 101) return message.channel.send("❌ Cannot raise the volume any more");
					client.player.setVolume(message, queue.volume + 10);
					message.channel
						.send(`🔊 **${user.username}** has increased the volume to ${queue.volume}`)
						.catch(console.error);
					break;

				case "🔇":
					reaction.users.remove(user).catch(console.error);
					if (!track.requestedBy.id == user.id || !member.hasPermission('MANAGE_CHANNELS')) return;
					if (queue.volume == 0) {
						client.player.setVolume(message, 100);
						message.channel.send(`🔊 **${user.username}** unmuted the queue`).catch(console.error);
					} else {
						client.player.setVolume(message, 0);
						message.channel.send(`🔇 **${user.username}** muted the queue`).catch(console.error);
					}
					break;

				default:
					reaction.users.remove(user).catch(console.error);
					break;

			}

		});

		collector.on("end", () => {
			messageSent.reactions.removeAll().catch(console.error);
		});
	},
};
