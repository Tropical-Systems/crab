const {
  ModalBuilder,
  TextInputBuilder,
  MessageFlags,
  TextInputStyle,
  RoleSelectMenuBuilder,
  LabelBuilder,
} = require("discord.js");
const { x } = require("../../../emojis.json");
const crabShiftTypeConfig = require("../../schemas/CrabShiftType");
module.exports = {
  customIdPrefix: "custom_shift_type-edit",
  execute: async (interaction) => {
    const [_, typeId] = interaction.values[0].split(":");
    const GuildShiftTypes = await crabShiftTypeConfig.findOne({
      guildId: interaction.guild.id,
      type_id: typeId,
    });

    const modal = new ModalBuilder()
      .setTitle(`Edit Shift Type: ${GuildShiftTypes.name}`)
      .setCustomId(`crab_modal-shift_type_edit:${typeId}`);

    const TypeNameComponent = new TextInputBuilder()
      .setCustomId("crab_input-shift_type_name")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);
    const RoleSelect = new RoleSelectMenuBuilder()
      .setCustomId("crab_select-shift_type_roles")
      .setMaxValues(5)
      .setRequired(false);

    modal.addLabelComponents(
      new LabelBuilder()
        .setTextInputComponent(TypeNameComponent)
        .setDescription(
          "Leave blank to remain unchanged. Type a new name to change."
        )
        .setLabel("Shift Type Name")
    );
    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel("Authorized Roles")
        .setDescription(
          "Leave blank to remain unchanged. Select new roles to change authorization settings."
        )
        .setRoleSelectMenuComponent(RoleSelect)
    );
    await interaction.showModal(modal)
  },
};
