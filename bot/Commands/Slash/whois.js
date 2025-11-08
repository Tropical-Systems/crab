const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  crown,
  clipboard_list,
  officer,
  layout_dashboard,
  brain,
  settings,
  tool,
  life_buoy,
  headset,
  user_group,
  discord_staff,
  hs_balance,
  hs_bravery,
  hs_brilliance,
  partnered_server,
  hype_squad_event,
  early_supporter,
  early_verified_app,
  bug_hunter_1,
  bug_hunter_2,
  active_dev,
  verified_app,
  mod_program,
} = require("../../../emojis.json");

const tropicalRoles = require("../../../staff-roles.json");
const { supportServer } = require("../../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get information about yourself or another user!")
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription("Select a user you wish to lookup.")
        .setRequired(false)
    ),

  execute: async (interaction, client) => {
    const user = interaction.options.getUser("user") || interaction.user;

    // Try to fetch member in current guild
    let guildMember = null;
    try {
      guildMember = await interaction.guild.members.fetch(user.id);
    } catch {}

    // Try to fetch member in support server
    let staffMember = null;
    try {
      const supportGuild = await client.guilds.fetch(supportServer);
      staffMember = await supportGuild.members.fetch(user.id);
    } catch {}

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `@${user.username}`,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(0xec3935)
      .setTimestamp()
      .setThumbnail(user.displayAvatarURL())
      .setImage(
        "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png"
      )
      .addFields(
        {
          name: "Discord Information:",
          value: `>>> ${user}\nUser ID: ${
            user.id
          }\nJoined Discord: <t:${Math.floor(user.createdAt / 1000)}:F>${
            guildMember?.joinedTimestamp
              ? `\nJoined Server: <t:${Math.floor(
                  guildMember.joinedTimestamp / 1000
                )}:F>`
              : ""
          }`,
        },
      );
    
    const fetchedUser = await user.fetch();
    const badges = fetchedUser.flags?.toArray?.() || [];

    // Filter out redundant verified badges for bots
    const filteredBadges = user.bot
      ? badges.filter(
          (b) =>
            ![
              "VerifiedBot",
              "VerifiedBotDeveloper",
              "VerifiedDeveloper",
            ].includes(b)
        )
      : badges;

    // Badge-to-emoji map
    const badgeMap = {
      Staff: `${discord_staff} Discord Staff`,
      Partner: `${partnered_server} Partnered Server Owner`,
      Hypesquad: `${hype_squad_event} HypeSquad Events`,
      BugHunterLevel1: `${bug_hunter_1} Bug Hunter Level 1`,
      BugHunterLevel2: `${bug_hunter_2} Bug Hunter Level 2`,
      HypeSquadOnlineHouse1: `${hs_bravery} HypeSquad Bravery`,
      HypeSquadOnlineHouse2: `${hs_brilliance} HypeSquad Brilliance`,
      HypeSquadOnlineHouse3: `${hs_balance} HypeSquad Balance`,
      PremiumEarlySupporter: `${early_supporter} Early Supporter`,
      VerifiedDeveloper: `${early_verified_app} Verified Bot Developer`,
      CertifiedModerator: `${mod_program} Discord Certified Moderator`,
      ActiveDeveloper: `${active_dev} Active Developer`,
    };

    // Map filtered badges
    const badgeDisplay = filteredBadges.map((b) => badgeMap[b] || b);

    // Always show bot badge if bot
    if (user.bot) badgeDisplay.push(`${verified_app} Bot Account`);
    if (badgeDisplay.length !== 0) {
      embed.addFields(        {
          name: `Badges [${badgeDisplay.length}]:`,
          value: `>>> ${badgeDisplay.join("\n") || "None"}`,
        },)
    }
    // Role display
    let roles = [];
    if (guildMember) {
      const everyoneRole = interaction.guild.roles.everyone;
      roles = guildMember.roles.cache
        .filter((r) => r.id !== everyoneRole.id)
        .sort((a, b) => b.position - a.position)
        .map((r) => r.toString());
    }
    if (roles.length !== 0) {
      embed.addFields(        {
          name: `Roles [${roles.length}]:`,
          value: `>>> ${roles.join(", ") || "None"}`,
        })
    }

    // Build base embed
    
    let staffTitle = null;
    let staffEmoji = null;

    if (staffMember) {
      const match = Object.entries(tropicalRoles).find(([roleId]) =>
        staffMember.roles.cache.has(roleId)
      );

      if (match) {
        const [roleId, data] = match;
        staffTitle = data.name;
        staffEmoji = data.emoji;
      }
    }

    let staffStatus;
    if (staffTitle) {
      staffStatus = `${staffEmoji} ${staffTitle}`;
      embed.addFields({
        name: "Staff Information:",
        value: `>>> ${staffStatus}`,
      });
    }

    return interaction.reply({ embeds: [embed] });
  },
};
