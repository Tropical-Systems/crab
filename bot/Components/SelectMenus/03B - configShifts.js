const { EmbedBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ActionRowBuilder, ChannelType, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, MessageFlags } = require('discord.js')
const { back_arrow, circle_1, circle_2, circle_3, circle_4, circle_5, add_sign } = require("../../../emojis.json")
const crabConfig = require('../../schemas/CrabConfig')
const crabShiftTypeConfig = require('../../schemas/CrabShiftType')
module.exports = {
  customId: 'crab-sm_shifts',
  execute: async (interaction) => {
    const GuildConfig = await crabConfig.findOne({ guildId: interaction.guild.id })
    const embed = interaction.message.embeds[0]
    const ConfigEmbed = EmbedBuilder.from(embed)
    ConfigEmbed.setDescription(`You are now configuring the **shifts** module of Crab! Below you will find the configuration you will set:\n* **Shift Logging**\n  * Select the channel you wish to log your shifts in.\n* **On-Duty Role**\n  * Select the role you wish to set as the on duty role assigned to personnel on duty.\n* **On-Break Role**\n  * Select the role you wish to set as the on break role assigned to personnel on break.\n* **Shift Types**\n  * Select the shift types that best align with your server.\n-# If you need to clear the select menu options below, go to a different channel and then return to this one.`)
    const GuildShiftTypes = await crabShiftTypeConfig.find({ guildId: interaction.guild.id}) || 0
    const ShiftLogChannelSelect = new ChannelSelectMenuBuilder()
    .setChannelTypes(ChannelType.GuildText)
    .setCustomId("crab-sm_shift-log")
    .setMaxValues(1)
    .setPlaceholder('Shift Logging')
    const ShiftODRoleSelect = new RoleSelectMenuBuilder()
    .setCustomId('crab-sm_on-duty-role')
    .setMaxValues(1)
    .setPlaceholder("On-Duty Role")
    const ShiftOBRoleSelect = new RoleSelectMenuBuilder()
    .setCustomId('crab-sm_on-break-role')
    .setMaxValues(1)
    .setPlaceholder("On-Break Role")
    const ShiftTypesMenu = new StringSelectMenuBuilder()
    .setCustomId('crab-sm_shift-types')
    .setMaxValues(1)
    .setPlaceholder("Configure Custom Shift Types")
    .setMaxValues(1)
    .addOptions(
      new StringSelectMenuOptionBuilder()
      .setEmoji(add_sign)
      .setLabel(`Add Shift Type (${(GuildShiftTypes.length)}/5)`)
      .setValue(`custom_shift_type-add:${(GuildConfig.shift_Types?.length || 0) + 1}`),
    )
    const backButton = new ButtonBuilder()
    .setCustomId('crab-button_back')
    .setEmoji(back_arrow)
    .setLabel('Back')
    .setStyle(ButtonStyle.Success);
    for (let i = 0; i < GuildShiftTypes.length; i++) {
      const GuildShiftType = GuildShiftTypes[i]
      const emoji = eval(`circle_${i + 1}`);
     ShiftTypesMenu.addOptions(
      new StringSelectMenuOptionBuilder()
      .setLabel(`Edit ${GuildShiftType.name}`)
      .setEmoji(emoji)
      .setValue(`custom_shift_type-edit:${GuildShiftType.type_id}`),
    )
    }
    const row1 = new ActionRowBuilder().addComponents(ShiftLogChannelSelect)
    const row2 = new ActionRowBuilder().addComponents(ShiftODRoleSelect)
    const row3 = new ActionRowBuilder().addComponents(ShiftOBRoleSelect)
    const row4 = new ActionRowBuilder().addComponents(ShiftTypesMenu)
    const row5 = new ActionRowBuilder().addComponents(backButton)
    interaction.update({ embeds: [ConfigEmbed], components: [row1, row2, row3, row4, row5] })
  }
}
