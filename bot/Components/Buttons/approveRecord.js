const {
  EmbedBuilder,
  inlineCode,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const GuildRecord = require("../../schemas/GuildRecord");
const { check } = require("../../../emojis.json");
module.exports = {
  customId: "crab-button_record-approve",
  execute: async (interaction, client) => {
    const GuildConfig = await CrabConfig.findOne({
      guildId: interaction.guild.id,
    });
    const SupervisorRole = GuildConfig.perms_SupervisorRole;
    const HiCommRole = GuildConfig.perms_HiCommRole;
    const AARole = GuildConfig.perms_AllAccessRole;
    if (
      interaction.member.roles.cache.has(SupervisorRole) ||
      interaction.member.roles.cache.has(HiCommRole) ||
      interaction.member.roles.cache.has(AARole)
    ) {
      const Record = await GuildRecord.findOneAndUpdate(
        { messageId: interaction.message.id },
        { $set: { reviewedBy: interaction.user.id } },
        { new: true }
      );
      const embed = interaction.message.embeds[0];
      const user = await interaction.guild.members.fetch(Record.issuedBy);
      const ApprovedEmbed = EmbedBuilder.from(embed);
      ApprovedEmbed.setColor(0x2a9d8f);
      const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Sent from ${interaction.guild.name}`);
      const DMEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
          `${check} Your record has been **approved** by <@${Record.reviewedBy}>.`
        );
      const row = new ActionRowBuilder().addComponents(serverButton);
      interaction.update({
        content: `This record has been approved by ${interaction.user}`,
        embeds: [ApprovedEmbed],
        components: [],
      });
      if (user) {
        try {
          await user.send({
            embeds: [DMEmbed],
            components: [row],
          });
        } catch (err) {
          return interaction.followUp({
            content: "I could not DM this user.",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    } else {
      interaction.reply({
        content: "**Insufficient** permissions.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
