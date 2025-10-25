const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const CrabReport = require("../../schemas/GuildReport");
const CrabCustomReports = require("../../schemas/CrabCustomReports");
const {
  check,
  x,
  car,
  clipboard,
  flag,
  fire_truck,
  flame,
  medical_cross,
  barrier,
  search,
  circle_1,
  circle_2,
  circle_3,
} = require("../../../emojis.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("..")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Open our report panel and create a report.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for a report via the identification string.")
        .addUserOption((user) =>
          user
            .setName("staff-username")
            .setDescription(
              "The username of the staff member your are searching reports for."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("void")
        .setDescription("Void/Delete a report via the identification string.")
        .addStringOption((option) =>
          option
            .setName("report-id")
            .setDescription(
              "The identification string of the report you are voiding/deleting."
            )
            .setRequired(true)
        )
    ),
  execute: async (interaction) => {
    const subcommand = interaction.options.getSubcommand();
    const GuildConfig = await CrabConfig.findOne({
      guildId: interaction.guild.id,
    });
    const GuildReports = await CrabReport.find({
      guildId: interaction.guild.id,
    });
    const GuildCustomReports = await CrabCustomReports.find({
      guildId: interaction.guild.id,
    });
    const PersonnelRole = GuildConfig.perms_PersonnelRole;
    const SupervisorRole = GuildConfig.perms_SupervisorRole;
    const HiCommRole = GuildConfig.perms_HiCommRole;
    const AARole = GuildConfig.perms_AllAccessRole;
    const departmentType = GuildConfig.crab_DepartmentType;
    if (
      interaction.member.roles.cache.has(
        PersonnelRole || SupervisorRole || HiCommRole || AARole
      )
    ) {
      if (subcommand === "create") {
        if (departmentType === "leo") {
          const embed = new EmbedBuilder()
            .setColor(0xec3935)
            .setDescription(
              `To record a report, please select which report you want to record. Each report is tailored to your department: **Law Enforcement**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Scene Reports\n- Incident Reports`
            )
            .setFooter({ text: "Powered by Crab" })
            .setTitle("Report Panel")
            .setImage(
              "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
            );

          const ReportSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("crab-sm_report-leo")
            .setPlaceholder("Select a report type.")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Accident Report")
                .setDescription("File an accident report on your vehicle.")
                .setValue("crab_accident-report")
                .setEmoji(car),
              new StringSelectMenuOptionBuilder()
                .setLabel("Scene Report")
                .setDescription("File an scene report on a crime scene.")
                .setValue("crab_scene-report")
                .setEmoji(clipboard),
              new StringSelectMenuOptionBuilder()
                .setLabel("Incident Report")
                .setDescription("File an incident report.")
                .setValue("crab_incident-report")
                .setEmoji(flag)
            );
          if (GuildCustomReports.length !== 0) {
            const CustomReportsNames = [];
            for (let i = 0; i < GuildCustomReports.length; i++) {
              const CustomReport = GuildCustomReports[i];
              const emoji = eval(`circle_${i + 1}`);
              CustomReportsNames.push(`- ${CustomReport.crab_ReportName}`);
              const customReportSelect = new StringSelectMenuOptionBuilder()
                .setLabel(CustomReport.crab_ReportName)
                .setEmoji(emoji)
                .setValue(`crab_custom_report:${CustomReport.crab_ReportId}`);
              ReportSelectMenu.addOptions(customReportSelect);
            }
            embed.addFields({
              name: "Custom Reports:",
              value: CustomReportsNames,
            });
          }
          const row = new ActionRowBuilder().addComponents(ReportSelectMenu);
          interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
          });
        } else if (departmentType === "fd-med") {
          const embed = new EmbedBuilder()
            .setColor(0xec3935)
            .setDescription(
              `To record a report, please select which report you want to record. Each report is tailored to your department: **Fire and Medical**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Fire Reports\n- Medical Reports`
            )
            .setFooter({ text: "Powered by Crab" })
            .setImage(
              "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
            )
            .setTitle("Report Panel");

          const ReportSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("crab-sm_report-fd-med")
            .setPlaceholder("Select a report type.")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Accident Report")
                .setDescription("File an accident report on your vehicle.")
                .setValue("crab_accident-report")
                .setEmoji(fire_truck),
              new StringSelectMenuOptionBuilder()
                .setLabel("Fire Report")
                .setDescription("File an fire report.")
                .setValue("crab_fire-report")
                .setEmoji(flame),
              new StringSelectMenuOptionBuilder()
                .setLabel("Medical Report")
                .setDescription("File an medical report.")
                .setValue("crab_medical-report")
                .setEmoji(medical_cross)
            );
          if (GuildCustomReports.length !== 0) {
            const CustomReportsNames = [];
            for (let i = 0; i < GuildCustomReports.length; i++) {
              const CustomReport = GuildCustomReports[i];
              const emoji = eval(`circle_${i + 1}`);
              CustomReportsNames.push(`- ${CustomReport.crab_ReportName}`);
              const customReportSelect = new StringSelectMenuOptionBuilder()
                .setLabel(CustomReport.crab_ReportName)
                .setEmoji(emoji)
                .setValue(`crab_custom_report:${CustomReport.crab_ReportId}`);
              ReportSelectMenu.addOptions(customReportSelect);
            }
            embed.addFields({
              name: "Custom Reports:",
              value: CustomReportsNames.join(`\n`),
            });
          }
          const row = new ActionRowBuilder().addComponents(ReportSelectMenu);
          interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
          });
        } else if (departmentType === "dot") {
          const embed = new EmbedBuilder()
            .setColor(0xec3935)
            .setDescription(
              `To record a report, please select which report you want to record. Each report is tailored to your department: **Department of Transportation**. All report types available to the department you work for will be listed below.\n\n- Accident Reports\n- Repair Reports\n- Tow Reports`
            )
            .setFooter({ text: "Powered by Crab" })
            .setImage(
              "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
            )
            .setTitle("Report Panel");

          const ReportSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("crab-sm_report-dot")
            .setPlaceholder("Select a report type.")
            .addOptions(
              new StringSelectMenuOptionBuilder()
                .setLabel("Accident Report")
                .setDescription("File an accident report on your vehicle.")
                .setValue("crab_accident-report")
                .setEmoji(car),
              new StringSelectMenuOptionBuilder()
                .setLabel("Repair Report")
                .setDescription("File an repair report.")
                .setValue("crab_repair-report")
                .setEmoji(barrier),
              new StringSelectMenuOptionBuilder()
                .setLabel("Tow Report")
                .setDescription("File an tow report.")
                .setValue("crab_tow-report")
                .setEmoji(flag)
            );
          if (GuildCustomReports.length !== 0) {
            const CustomReportsNames = [];
            for (const CustomReportType of GuildCustomReports) {
              CustomReportsNames.push(`${CustomReportType.crab_ReportName}\n`);
              const customReport = new StringSelectMenuOptionBuilder()
                .setLabel(CustomReportType.crab_ReportName)
                .setValue(
                  `crab_custom_report:${CustomReportType.crab_ReportId}`
                );
              ReportSelectMenu.addOptions(customReport);
            }
            embed.addFields({
              name: "Custom Reports:",
              value: CustomReportsNames,
            });
          }

          const row = new ActionRowBuilder().addComponents(ReportSelectMenu);
          interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
          });
        } else {
          interaction.reply("Department **not configured**.");
        }
      } else if (subcommand === "search") {
        const userId = interaction.options.getUser("staff-username").id;
        const UserReports = await CrabReport.find({
          guildId: interaction.guild.id,
          IssuedBy: userId,
        })
          .sort({ _id: -1 })
          .limit(10);
        if (UserReports.length === 0) {
          return interaction.reply({
            content: "This user has not yet created a report.",
          });
        }
        try {
          let Reports = [];
          for (const Report of UserReports) {
            const ReportID = Report.id;
            if (Report.ReportType === "custom") {
              const CustomReportInformation = await CrabCustomReports.findOne({
                guildId: interaction.guild.id,
                crab_ReportId: Report.custom_reportId,
              });
              let ReportName = []
              if (CustomReportInformation.crab_ReportName.endsWith("Report")) {
                ReportName.push(CustomReportInformation.crab_ReportName)
              } else {
                ReportName.push(CustomReportInformation.crab_ReportName, "Report")
                ReportName.join(" ")
              }
              const embed = new EmbedBuilder()
                .setColor(0xec3935)
                .setFooter({ text: `Report ID: ${ReportID}` })
                .setDescription(
                  `Below are details of the **${ReportName}** submitted by <@${Report.IssuedBy}>.`
                )
                .setImage(
                  "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
                )
                .setTitle(`${ReportName}`);

              if (Report.custom_field1 !== null) {
                embed.addFields({
                  name: `${CustomReportInformation.crab_ReportField1Label}:`,
                  value: `${Report.custom_field1}`,
                });
              }
              if (Report.custom_field2 !== null) {
                embed.addFields({
                  name: `${CustomReportInformation.crab_ReportField2Label}:`,
                  value: `${Report.custom_field2}`,
                });
              }
              if (Report.custom_field3 !== null) {
                embed.addFields({
                  name: `${CustomReportInformation.crab_ReportField3Label}:`,
                  value: `${Report.custom_field3}`,
                });
              }
              if (Report.ReviewedBy !== null) {
                embed.addFields({
                  name: `Report Reviewer:`,
                  value: `<@${Report.ReviewedBy}>`,
                });
              }
              Reports.push(embed);
            } else {
            let ReportName = []
              if (Report.ReportType.endsWith("Report")) {
                ReportName.push(Report.ReportType)
              } else {
                ReportName.push(Report.ReportType, "Report")
                ReportName.join(" ")
              }
              const ReportDescription = Report.Description;
              const ReportReviewer = Report.ReviewedBy;
              const embed = new EmbedBuilder()
                .setColor(0xec3935)
                .setFooter({ text: `Report ID: ${ReportID}` })
                .setDescription(
                  `Below are details of the **${ReportName}** submitted by <@${Report.IssuedBy}>.`
                )
                .setImage(
                  "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
                )
                .setTitle(`${ReportName}`)
                .addFields(
                  {
                    name: `Report Description`,
                    value: `${ReportDescription}`,
                  }
                );
              if (Report.ReviewedBy !== null) {
                embed.addFields({
                  name: "Reviewed by:",
                  value: `<@${ReportReviewer}>`,
                });
              }
              Reports.push(embed);
            }
          }
          await interaction.reply({
            embeds: Reports,
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          // ! Need to check if error is handled by handler.
        }
      } else if (subcommand === "void") {
        const ReportId = interaction.options.getString("report-id");
        await interaction.reply({
          content: `${search} **Fetching** the report...`,
        });
        const response = await interaction.fetchReply();
        const Report = await CrabReport.findOne({
          guildId: interaction.guild.id,
          id: ReportId,
        });
        if (!Report) {
          return await interaction.editReply({
            content: `${x} I was unable to locate a report with that id, please double check the ID and try again.`,
          });
        }
        const confirmDelete = new ButtonBuilder()
          .setCustomId(
            `crab_button-confirm_delete:${response.id}:${interaction.user.id}:${ReportId}`
          )
          .setEmoji(check)
          .setLabel("Confirm Delete")
          .setStyle(ButtonStyle.Danger);
        const cancelDelete = new ButtonBuilder()
          .setCustomId(
            `crab_button-cancel_delete:${response.id}:${interaction.user.id}`
          )
          .setEmoji(x)
          .setLabel("Cancel Delete")
          .setStyle(ButtonStyle.Secondary);

        const confirmationRow = new ActionRowBuilder().addComponents(
          confirmDelete,
          cancelDelete
        );
        await interaction.editReply({
          content: `${check} I was able to locate a report with this id string, would you like to proceed and void the report?\n-# This action is **irreversible**.`,
          components: [confirmationRow],
        });
      }
    } else {
      return interaction.reply(`${x} **Insufficient** permissions.`);
    }
  },
};
