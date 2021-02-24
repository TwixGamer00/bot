const { MessageAttachment } = require("discord.js");
const canvacord = require("canvacord");
module.exports.run = async (client, message, args) => {
    if (!args[0]) args[0] = message.author.id;
	client.GetMemberFromArg(args[0], message.guild.members).then(async member => {
		if (!member) member = message.member;
		const level = await client.db.level.get(`${message.guild.id}/${member.id}`) || 0;
		const xp = await client.db.xp.get(`${message.guild.id}/${member.id}`) || 0;
		const newXP = await client.xpNeeded(level + 1);
		const avatarURL = await getProfilePic(member.user);

		const rankCard = new canvacord.Rank()
        .setAvatar(avatarURL)
        .setCurrentXP(xp)
        .setLevel(level)
        .setRank(1, "rank", false)
        .setStatus(member.presence.status)
        .setRequiredXP(newXP)
        .setProgressBar("GREEN", "COLOR")
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator);
        rankCard.build()
        .then(data => {
            const image = new MessageAttachment(data, "RankCard.png");

            message.channel.send(image);
        });
		
	}).catch(err => {
		return message.channel.send(err);
	});
};


exports.help = {
	name: "levels",
	category: "Levels",
	description: "Check someone their level",
	usage: "levels [GuildMember]",
};



function getProfilePic(user) {
	if (user.avatar == null) {
		return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;
	} else {
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
	}
}
