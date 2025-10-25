const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
  inlineCode,
  AttachmentBuilder
} = require("discord.js");
const crabConfig = require("../../schemas/CrabConfig.js");
const { fire_truck, officer, traffic_light, message, lock_pass, barrier, clock, clipboard, flag, trending_up, repeat } = require("../../../emojis.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure Crab's behavior for your server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  execute: async (interaction) => {
    const GuildConfig = await crabConfig.findOne({ guildId: interaction.guild.id })
    const GuildPrefix = GuildConfig?.crab_Prefix ?? "-"
    if (!GuildConfig) {
      const embed = new EmbedBuilder()
        .setColor(0xec3935)
        .setTitle("Configure Crab")
        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
        .setDescription(
          `**Crab** is an easy to use management bot for your department! We allow our users to easily customize **Crab** to ensure the most flexibility with all situations!\n\nTo begin, you will need to set the type of department you are using **Crab** for:\n- **Configure Department Type**: Select one of the options (Law Enforcement, Fire and Medical, and Department of Transportation.)\n-# You can change the department type in the next step if needed.`
        );

      const departmentSelectionMenu = new StringSelectMenuBuilder()
        .setCustomId("crab-sm_department-selection")
        .setPlaceholder("Configure Department Types")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setEmoji(officer)
            .setLabel("Law Enforcement")
            .setValue("crab-sm_le"),
          new StringSelectMenuOptionBuilder()
            .setEmoji(fire_truck)
            .setLabel("Fire and Medical")
            .setValue("crab-sm_fd-med"),
          new StringSelectMenuOptionBuilder()
            .setEmoji(traffic_light)
            .setLabel("Department of Transportation")
            .setValue("crab-sm_dot")
        );

      const departmentSelectionRow = new ActionRowBuilder().addComponents(
        departmentSelectionMenu
      );
      interaction.reply({
        embeds: [embed],
        components: [departmentSelectionRow],
        flags: MessageFlags.Ephemeral,
      });
    } else {
      const departmentType = GuildConfig.crab_DepartmentType;

      if (departmentType === "leo") {
        const file = new AttachmentBuilder("bot/Images/embed-banner.png")
        const embed = new EmbedBuilder()
          .setColor(0xec3935)
          .setTitle("Configure Crab")
          .setDescription(
            `You have selected the **Law Enforcement** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${message} Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **${clock} Shift Logging**\n  * Easily log your department personnel"s shifts with our shift logging system!\n* ** ${clipboard} Record Management**\n  * Seamlessly record your arrests, citations, and traffic warnings using our record management system.\n* **${flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${repeat} Change Module**\n  * Switch the module from **Law Enforcement** to **Fire and Medical** or **Department of Transportation** easily!`
          )
          .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")


        const leoSelect = new StringSelectMenuBuilder()
          .setCustomId("crab-sm_le-plugins")
          .setPlaceholder("Configure Law Enforcement Plugins")
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setEmoji(lock_pass)
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(message)
              .setLabel("Configure Prefix")
              .setValue("crab-sm_prefix"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(clock)
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(clipboard)
              .setLabel("Record Management")
              .setValue("crab-sm_records"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(flag)
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(trending_up)
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(repeat)
              .setLabel("Change Module")
              .setValue("crab-sm_change")
          );
        const row = new ActionRowBuilder().addComponents(leoSelect);
        interaction.reply({
          embeds: [embed],
          components: [row],
          flags: MessageFlags.Ephemeral
        });
      } else if (departmentType === "fd-med") {
        const file = new AttachmentBuilder("bot/Images/embed-banner.png")
        const embed = new EmbedBuilder()
          .setColor(0xec3935)
          .setTitle("Configure Crab")
          .setImage("attachment://embed-banner.png")
          .setDescription(`You have selected the **Fire and Medical** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${message} Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **${clock} Shift Logging**\n  * Easily log your department personnel"s shifts with our shift logging system!\n* **${flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${repeat} Change Module**\n  * Switch the module from **Law Enforcement** to **Law Enforcement** or **Department of Transportation** easily!`)

        const fdMedSelect = new StringSelectMenuBuilder()
          .setCustomId("crab-sm_fd-med-plugins")
          .setPlaceholder("Configure Fire and Medical Plugins")
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setEmoji(lock_pass)
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(message)
              .setLabel("Configure Prefix")
              .setValue("crab-sm_prefix"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(clock)
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(flag)
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(trending_up)
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(repeat)
              .setLabel("Change Module")
              .setValue("crab-sm_change")
          );
        const row = new ActionRowBuilder().addComponents(fdMedSelect);
        interaction.reply({
          embeds: [embed],
          components: [row],
          flags: MessageFlags.Ephemeral,
          files: [file]
        });
      } else if (departmentType === "dot") {
        const embed = new EmbedBuilder()
          .setColor(0xec3935)
          .setTitle("Configure Crab")
          .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
          .setDescription(`You have selected the **Department of Transportation** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${message} Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(GuildPrefix)}\n* **${clock} Shift Logging**\n  * Easily log your department personnel"s shifts with our shift logging system!\n* **${flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${repeat} Change Module**\n  * Switch the module from **Department of Transportation** to **Fire and Medical** or **Law Enforcement** easily!`)

        const dotSelect = new StringSelectMenuBuilder()
          .setCustomId("crab-sm_dot-plugins")
          .setPlaceholder("Configure Department of Transportation Plugins")
          .setOptions(
            new StringSelectMenuOptionBuilder()
              .setEmoji(lock_pass)
              .setLabel("Configure Permissions")
              .setValue("crab-sm_perms"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(message)
              .setLabel("Configure Prefix")
              .setValue("crab-sm_prefix"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(clock)
              .setLabel("Shift Logging")
              .setValue("crab-sm_shifts"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(flag)
              .setLabel("Reports")
              .setValue("crab-sm_reports"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(trending_up)
              .setLabel("Promotions, Infractions, and Demotions")
              .setValue("crab-sm_staff"),
            new StringSelectMenuOptionBuilder()
              .setEmoji(repeat)
              .setLabel("Change Module")
              .setValue("crab-sm_change")
          );
        const row = new ActionRowBuilder().addComponents(dotSelect);
        interaction.reply({
          embeds: [embed],
          components: [row],
          flags: MessageFlags.Ephemeral,
        });
      } else {
        const embed = new EmbedBuilder()
        .setColor(0xec3935)
        .setTitle("Configure Crab")
        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
        .setDescription(
          `**Crab** is an easy to use management bot for your department! We allow our users to easily customize **Crab** to ensure the most flexibility with all situations!\n\nTo begin, you will need to set the type of department you are using **Crab** for:\n- **Configure Department Type**: Select one of the options (Law Enforcement, Fire and Medical, and Department of Transportation.)\n-# You can change the department type in the next step if needed.`
        );

      const departmentSelectionMenu = new StringSelectMenuBuilder()
        .setCustomId("crab-sm_department-selection")
        .setPlaceholder("Configure Department Types")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setEmoji(officer)
            .setLabel("Law Enforcement")
            .setValue("crab-sm_le"),
          new StringSelectMenuOptionBuilder()
            .setEmoji(fire_truck)
            .setLabel("Fire and Medical")
            .setValue("crab-sm_fd-med"),
          new StringSelectMenuOptionBuilder()
            .setEmoji(traffic_light)
            .setLabel("Department of Transportation")
            .setValue("crab-sm_dot")
        );

      const departmentSelectionRow = new ActionRowBuilder().addComponents(
        departmentSelectionMenu
      );
      interaction.reply({
        embeds: [embed],
        components: [departmentSelectionRow],
        flags: MessageFlags.Ephemeral,
      });
      }
    }
  },
};
