module.exports = {
    name: "say",
    aliases: ["repeat"],
    execute: async (message, args) => {
        var text = args.join(' ');
        if(!text) return message.channel.send(`<@${message.author.id}> Usage: \`mk!say [Text]\``);
        message.channel.send(text);
    },
};