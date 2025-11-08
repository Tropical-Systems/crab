const {
  ModalBuilder,
  TextInputBuilder,
  MessageFlags,
  TextInputStyle,
  RoleSelectMenuBuilder,
  LabelBuilder,
} = require("discord.js");
const { x } = require("../../../emojis.json")
const crabShiftTypeConfig = require("../../schemas/CrabShiftType");
module.exports = {
  customIdPrefix: "custom_shift_type-add",
  execute: async (interaction) => {
    MAX_SHIFT_TYPES = 5
    MAX_SHIFT_ROLES = 5
    const [_, typeNumber] = interaction.values[0].split(":");
    const GuildShiftTypes = await crabShiftTypeConfig.find({ guildId: interaction.guild.id})
    if (GuildShiftTypes.length >= MAX_SHIFT_TYPES) {
      return interaction.reply({ content: `${x}, you have reached the limit of custom shift types. You cannot make any more, if you wish you can remove a current custom shift type.`, flags: MessageFlags.Ephemeral })
    }
    const modal = new ModalBuilder()
      .setTitle("Shift Type Configuration")
      .setCustomId(`crab_modal-shift_type_add:${typeNumber}`);

    const TypeNameComponent = new TextInputBuilder()
      .setCustomId("crab_input-shift_type_name")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);
    const RoleSelect = new RoleSelectMenuBuilder()
      .setCustomId("crab_select-shift_type_roles")
      .setMaxValues(MAX_SHIFT_ROLES)
      .setRequired(true);

    modal.addLabelComponents(
      new LabelBuilder()
        .setTextInputComponent(TypeNameComponent)
        .setDescription("Input the name of your new shift type.")
        .setLabel("Shift Type Name")
    );
    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel("Authorized Roles")
        .setDescription("Define the roles authorized to use this shift type.")
        .setRoleSelectMenuComponent(RoleSelect)
    );

    await interaction.showModal(modal);
  },
};
