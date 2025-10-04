const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { getTropicalDb } = require("../../Functions/StartUp-Functions");
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

    let guildMember;
    try {
      guildMember = await interaction.guild.members.fetch(user.id);
    } catch {
      guildMember = null;
    }

    // fetch user flags/badges
    const flags = await user.fetch();
    const badges = flags.flags.toArray();
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

    const badgeDisplay = badges.map((b) => badgeMap[b] || b);

    // add bot badge if applicable
    if (user.bot) badgeDisplay.push(`${verified_app} User is a bot account.`);

    // add Tropical Systems staff badge from DB
    if (staffEntry) badgeDisplay.push(`${discord_staff} Tropical Systems ${staffEntry.PositionID}`);

    // roles (if member exists)
    let roles = [];
    if (guildMember) {
      const everyoneRole = interaction.guild.roles.everyone;
      roles = guildMember.roles.cache
        .filter((role) => role.id !== everyoneRole.id)
        .sort((a, b) => b.position - a.position)
        .map((r) => r);
    }

    // join timestamp
    const joinTimestamp = guildMember?.joinedTimestamp;

    // build embed
    const embed = new EmbedBuilder()
      .setAuthor({ name: `@${user.username}`, iconURL: user.displayAvatarURL() })
      .setColor(0xec3935)
      .setTimestamp()
      .setThumbnail(user.displayAvatarURL())
      .setImage(
        "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png"
      )
      .addFields(
        {
          name: "Discord Information:",
          value: `>>> ${user}\nUser ID: ${user.id}\nJoined Discord: <t:${Math.floor(
            user.createdAt / 1000
          )}:F>${joinTimestamp ? `\nJoined Server: <t:${Math.floor(joinTimestamp / 1000)}:F>` : ""}`,
        },
        {
          name: `Badges [${badgeDisplay.length}]:`,
          value: `>>> ${badgeDisplay.join("\n") || "None"}`,
        },
        {
          name: `Roles [${roles.length}]:`,
          value: `>>> ${roles.join(", ") || "None"}`,
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
