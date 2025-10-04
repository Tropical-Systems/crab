const { EmbedBuilder, inlineCode, codeBlock, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const CrabGuildExclusion = require("../schemas/CrabGuildExclusion");
const CrabUserExclusion = require("../schemas/CrabUserExclusion");
const { errorLogs, onCallRole } = require("../../config.json");
const { shield, x, alert } = require("../../emojis.json")
module.exports = {
  event: "interactionCreate",
  once: false,
  execute: async (client, interaction) => {
    const UserExcluded = await CrabUserExclusion.findOne({
      crab_UserID: interaction.user.id,
    });
    const GuildExluded = await CrabGuildExclusion.findOne({
      crab_guildId: interaction.guild.id,
    });
    if (GuildExluded) {
      interaction.reply(
        `${shield} This guild has been excluded from this service, the bot will now leave the guild.`
      );
      const user = await guild.fetchOwner();
      const ExclusionEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
          "This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE)."
        )
        .setFooter({ text: "Crab Legal Affairs Team" })
        .setTitle("Crab Exclusion Notice")
        .setTimestamp();
      const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Official Notice from Tropical Systems`);
      const row = new ActionRowBuilder().addComponents(serverButton);
      try {
        await user.send({ embeds: [ExclusionEmbed], components: [row] });
      } catch (error) {
        return;
      }
      client.guilds.cache.get(interaction.guild.id).leave();
      return;
    } else if (UserExcluded) {
      return interaction.reply(
        `${shield} You have been excluded from this service and cannot run any commands.`
      );
    }
    try {
      if (interaction.isAutocomplete()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command || typeof command.autocomplete !== "function") return;

        await command.autocomplete(interaction, client);
      }
      if (interaction.isCommand()) {
        const Command = client.slashCommands.get(interaction.commandName);
        if (!Command) {
          interaction.reply({
            content: "This command could not be found!",
            flags: ["Ephemeral"],
          });
          return;
        }
        await Command.execute(interaction, client);
      } else if (interaction.isButton()) {
        const Button = client.buttons.get(interaction.customId);
        const UserButton = [...client.userButtons.values()].find((b) =>
          interaction.customId.startsWith(b.customIdPrefix)
        );

        if (!Button && !UserButton) {
          return interaction.reply({
            content: "This button could not be found!",
            flags: ["Ephemeral"],
          });
        }

        if (Button) {
          await Button.execute(interaction, client);
        } else if (UserButton) {
          await UserButton.execute(interaction, client);
        }
      } else if (interaction.isAnySelectMenu()) {
        const SelectMenu =
          client.selectMenus.get(interaction.values[0]) ||
          client.selectMenus.get(interaction.customId);
        const UserSelectMenu = [...client.userSMs.values()].find((sm) =>
          interaction.customId.startsWith(sm.customIdPrefix)
        );
        if (!SelectMenu && !UserSelectMenu) {
          interaction.reply({
            content: "This select menu could not be found!",
            flags: ["Ephemeral"],
          });
          return;
        }
        if (SelectMenu) {
          await SelectMenu.execute(interaction, client);
        } else if (UserSelectMenu) {
          await UserSelectMenu.execute(interaction, client);
        }
      } else if (interaction.isModalSubmit()) {
        const Modal = client.modals.get(interaction.customId);
        const typeModals = [...client.typeModals.values()].find((tm) =>
          interaction.customId.startsWith(tm.customIdPrefix)
        );
        if (!Modal && !typeModals) {
          interaction.reply({
            content: "This modal could not be found!",
            flags: ["Ephemeral"],
          });
          return;
        }
        if (Modal) {
          await Modal.execute(interaction, client);
        } else if (typeModals) {
          await typeModals.execute(interaction, client);
        }
      } else return;
    } catch (error) {
      const channel = await client.channels.fetch(errorLogs);
      const guildName = interaction.guild?.name || "DM or Unknown Guild";
      const guildId = interaction.guild?.id || "N/A";
      const username = interaction.user?.username || "Unknown User";
      const userId = interaction.user?.id || "N/A";

      const safeError =
        (error instanceof Error ? error.message : String(error)) ||
        "Unknown error";
      const safeErrorTrunc = safeError.slice(0, 1024);

      // slice stack BEFORE wrapping in codeBlock
      const safeStackRaw = (error.stack || "No stack trace available")
        .toString()
        .slice(0, 1000);
      const safeStack = codeBlock(safeStackRaw);

      const ErrorReportEmbed = new EmbedBuilder()
        .setTitle("Error Report")
        .setColor(0xec3935)
        .setTimestamp()
        .setDescription(
          `An error has occured while running </${interaction.commandName}:${interaction.commandId}>. Please review the information below.`
        )
        .addFields(
          {
            name: "Guild Information",
            value: `${guildName} :: ${inlineCode(guildId)}`,
          },
          {
            name: "User Information",
            value: `${username} :: ${inlineCode(userId)}`,
          },
          {
            name: "Error Log",
            value: safeErrorTrunc,
          },
          {
            name: "Error Stack",
            value: safeStack,
          }
        );
        
      const ErrorEmbed = new EmbedBuilder()
      .setTitle(`${alert} System Error`)
      .setDescription(`An unexpected error has occurred in our system.\n\n> **__Things to know__**:\n> - Our team is actively working to fix this issue.\n> - Our team has been notified of this issue.\n> - We will fix this issue as soon as possible.\n\nIf you need any more assistance, please click the button below.`)
      .setColor(0xec3935)
      .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68bdf649&is=68bca4c9&hm=1c472a5ea35bacfff66d91e0357a5b3c46b90d9c0b611ed463e4ecc1a9468c1d&")
      .setTimestamp()

      const link = new ButtonBuilder()
      .setLabel("Join Tropical Systems")
      .setURL("https://discord.gg/tropicalsys")
      .setStyle(ButtonStyle.Link)

      const row = new ActionRowBuilder().addComponents(link)
      await channel.send({
        embeds: [ErrorReportEmbed],
        content: `<@&${onCallRole}>`,
      });
      if (!interaction.replied || !interaction.defered) {
      await interaction.reply({
        embeds: [ErrorEmbed],
        components: [row]
      });
      } else {
        await interaction.editReply({
        embeds: [ErrorEmbed],
        components: [row]
      });
      }
      console.log(
        `[ SYSTEM ][ INTERACTION ERROR ] There was an error while executing an interaction!\nError Stack: ${error.stack}`
      );
    }
  },
};
