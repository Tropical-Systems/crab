const { EmbedBuilder, inlineCode, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, Message, ButtonBuilder, ButtonStyle } = require('discord.js')
const CrabConfig = require('../../schemas/CrabConfig')
const GuildRecord = require('../../schemas/GuildRecord')
const { x } = require("../../../emojis.json")
module.exports = {
  customId: 'crab-button_record-deny',
  execute: async (interaction, client) => {
    const GuildConfig = await CrabConfig.findOne({ guildId: interaction.guild.id }) 
    const SupervisorRole = GuildConfig.perms_SupervisorRole
    const HiCommRole = GuildConfig.perms_HiCommRole
    const AARole = GuildConfig.perms_AllAccessRole

    if (interaction.member.roles.cache.has(SupervisorRole || HiCommRole || AARole)) {
      const Record = await GuildRecord.findOneAndDelete(
      { messageId: interaction.message.id },
    )
      const embed = interaction.message.embeds[0]
      const user = await interaction.guild.members.fetch(Record.issuedBy);
      const DenyEmbed = EmbedBuilder.from(embed)
      DenyEmbed.setColor(0xec3935)
      const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Sent from ${interaction.guild.name}`)
      const DMEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
          `${x} Your record has been **denied** by <@${Record.reviewedBy}>.`
        );
      const row = new ActionRowBuilder().addComponents(serverButton)
      interaction.update({ content: `This record has been denied by ${interaction.user}`, embeds: [DenyEmbed], components: [] })
      if (user) {
        try {
          await user.send({ embeds: [DMEmbed], components: [row]});
        } catch (err) {
          return interaction.followUp({ content: "I could not DM this user.", flags: MessageFlags.Ephemeral })
        }
      }
    } else {
      interaction.reply({ content: "**Insufficient** permissions.", flags: MessageFlags.Ephemeral })
    }
  }
}
