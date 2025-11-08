const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  inlineCode,
} = require("discord.js");
const CrabConfig = require("../../schemas/CrabConfig");
const CrabRecord = require("../../schemas/GuildRecord");
const searchRobloxUsers = require("../../Functions/searchRobloxUsernames")
const randomString = require("../../Functions/randomId")
const { check, x, search } = require("../../../emojis.json")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("record")
    .setDescription("..")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription(
          "Create a police record and broadcast it to on duty officers."
        )
        .addStringOption((option) =>
          option
            .setName("record-type")
            .setDescription("The type of record you are creating.")
            .setRequired(true)
            .addChoices(
              { name: "Vehicle BOLO", value: "Vehicle BOLO" },
              { name: "Suspect BOLO", value: "Suspect BOLO" },
              { name: "Arrest Warrant", value: "Arrest Warrant" },
              { name: "Search Warrant", value: "Search Warrant" },
              { name: "Arrest Record", value: "Arrest Record" },
              { name: "Citation Record", value: "Citation Record" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("suspect-username")
            .setDescription(
              "The username of the suspect you are issuing the report on."
            )
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("charges")
            .setDescription("List the charges on the suspect.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("armed")
            .setDescription("Is the suspect armed?")
            .setRequired(false)
            .addChoices(
              { name: "Yes", value: "Yes" },
              { name: "No", value: "No" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("dangerous")
            .setDescription("Is the suspect dangerous?")
            .setRequired(false)
            .addChoices(
              { name: "Yes", value: "Yes" },
              { name: "No", value: "No" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("mentally-ill")
            .setDescription("Is the suspect mentally ill?")
            .setRequired(false)
            .addChoices(
              { name: "Yes", value: "Yes" },
              { name: "No", value: "No" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search the database for records.")
        .addStringOption((option) =>
          option
            .setName("suspect-username")
            .setDescription(
              "The username of the suspect you are performing the search on."
            )
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("void")
        .setDescription("Delete a record from the database.")
        .addStringOption((option) =>
          option
            .setName("record-id")
            .setDescription(
              "The identifcation of the record you wish to delete."
            )
            .setRequired(true)
        )
    ),
  execute: async (interaction, client) => {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const GuildConfig = await CrabConfig.findOne({ guildId: guildId });
    const personnelRole = GuildConfig.perms_PersonnelRole;
    const supervisorRole = GuildConfig.perms_SupervisorRole;
    const hiCommRole = GuildConfig.perms_HiCommRole;
    const aaRole = GuildConfig.perms_AllAccessRole;
    const recordId = `record_${randomString(
      24,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )}`;

    if (
      personnelRole === undefined ||
      supervisorRole === undefined ||
      hiCommRole === undefined ||
      aaRole === undefined
    ) {
      await interaction.reply({
        content:
          "You cannot use the records module until your server administrator has configured it.",
      });
    } else {
      if (
        interaction.member.roles.cache.has(personnelRole) ||
        interaction.member.roles.cache.has(supervisorRole) ||
        interaction.member.roles.cache.has(hiCommRole) ||
        interaction.member.roles.cache.has(aaRole)
      ) {
        if (subcommand === "create") {
          const recordType = interaction.options.getString("record-type");
          const suspectUsername =
            interaction.options.getString("suspect-username");
          const charges = interaction.options.getString("charges");
          const armed = interaction.options.getString("armed") || "N/A";
          const dangerous = interaction.options.getString("dangerous") || "N/A";
          const mentallyIll = interaction.options.getString("mentally-ill") || "N/A";
          if ((recordType !== "Vehicle BOLO" && recordType !== "Suspect BOLO")) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `Record created by @${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setColor(0xec3935)
              .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
              .setDescription(
                `A new record has been created, you can view the details below.`
              )
              .addFields(
                {
                  name: "Recort Type:",
                  value: `${recordType}`,
                  inline: true,
                },
                {
                  name: "Suspect Username:",
                  value: `${suspectUsername}`,
                  inline: true,
                },
                {
                  name: "Suspect Flags:",
                  value: `**Armed?** ${armed}\n**Dangerous?** ${dangerous}\n**Mentally Ill?** ${mentallyIll}`,
                  inline: true,
                },
                { name: "Suspect Charges:", value: `${charges}`, inline: false }
              )
              .setFooter({ text: `Record ID: ${recordId} || Powered by Crab` });
            const ApproveButton = new ButtonBuilder()
              .setCustomId("crab-button_record-approve")
              .setLabel("Approve Record")
              .setStyle(ButtonStyle.Success);
            const DenyButton = new ButtonBuilder()
              .setCustomId("crab-button_record-deny")
              .setLabel("Deny Record")
              .setStyle(ButtonStyle.Danger);
            const row = new ActionRowBuilder().addComponents(
              ApproveButton,
              DenyButton
            );

            const recordChannel = GuildConfig.records_Logs;
            const channel = await interaction.guild.channels.fetch(
              recordChannel
            );
            if (channel) {
              const messageId = await channel.send({
                embeds: [embed],
                components: [row],
                content: `<@&${supervisorRole}>, a new record has been submitted.`,
              });
              await interaction.reply({
                content:
                  "**Successfully** sent your record and it is pending approval. You will be messaged when it is approved or denied.",
                flags: MessageFlags.Ephemeral,
              });
              const newRecord = new CrabRecord({
                guildId: guildId,
                suspectFlags: `Armed? **${armed}**, Dangerous? **${dangerous}**, Mentally Ill? **${mentallyIll}**`,
                suspectUsername: suspectUsername,
                charges: charges,
                issuedBy: interaction.user.id,
                recordType: recordType,
                reviewedBy: null,
                dateIssued: Date.now(),
                messageId: messageId.id,
                id: `${recordId}`,
              });
              await newRecord.save();
            } else {
              interaction.reply({
                content:
                  "I could not find the channel to send the record, it was **not** sent. Please contact your server administator for help.",
                flags: MessageFlags.Ephemeral,
              });
            }
          } else {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `Record created by @${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setColor(0xec3935)
              .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
              .setDescription(
                `A new record has been created, you can view the details below.`
              )
              .addFields(
                {
                  name: "Suspect Username:",
                  value: `${suspectUsername}`,
                  inline: true,
                },
                {
                  name: "Suspect Flags:",
                  value: `**Armed?** ${armed}\n**Dangerous?** ${dangerous}\n**Mentally Ill?** ${mentallyIll}`,
                  inline: true,
                },
                { name: "Suspect Charges:", value: `${charges}`, inline: false }
              )
              .setFooter({ text: `Record ID: ${recordId} || Powered by Crab` });

            const recordChannel = GuildConfig.records_Logs;
            const channel = await interaction.guild.channels.fetch(
              recordChannel
            );
            if (channel) {
              const message = await channel.send({
                embeds: [embed],
              });

            const newRecord = new CrabRecord({
              guildId: guildId,
              suspectFlags: `Armed? **${armed}**, Dangerous? **${dangerous}**, Mentally Ill? **${mentallyIll}**`,
              suspectUsername: suspectUsername,
              charges: charges,
              issuedBy: interaction.user.id,
              recordType: recordType,
              messageId: message.id,
              id: `${recordId}`,
            })
              await newRecord.save();
              await interaction.reply({
                content:
                  "**Successfully** sent your record!",
                flags: MessageFlags.Ephemeral,
              });
            } else {
              interaction.reply({
                content:
                  "I could not find the channel to send the record, it was **not** sent. Please contact your server administator for help.",
                flags: MessageFlags.Ephemeral,
              });
            }
          }
        } else if (subcommand === "search") {
          const suspect = interaction.options.getString("suspect-username");
          const SuspectResults = await CrabRecord.find({
            guildId: guildId,
            suspectUsername: suspect,
          }).sort({ _id: -1 }).limit(10);
          if (!SuspectResults || SuspectResults.length === 0) {
            return interaction.reply({
              content: "No record was found under that suspect's username.",
              flags: MessageFlags.Ephemeral,
            });
          } else { 
            let Embeds = []
            for (const record of SuspectResults) {
              const issuedDate = Math.floor(record.dateIssued / 1000);  
              const reviewedBy = record.reviewedBy || 'Not yet reviewed.' 
              const recordEmbed = new EmbedBuilder()
                .setColor(0xec3935)
                .setTitle(`Record Search Results`)
                .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
                .setDescription(`A record created by <@${record.issuedBy}>, the suspect's username is **${record.suspectUsername}**. You can find details below.`)
                .addFields(
                  {
                    name: "Suspect Charges:",
                    value: `${record.charges}`,
                    inline: true,
                  },
                  {
                    name: "Record Type:",
                    value: `${record.recordType}`,
                    inline: true,
                  },
                  {
                    name: "Suspect Flags:",
                    value: `${record.suspectFlags}`,
                    inline: true,
                  },
                  {
                    name: "Date Issued",
                    value: `<t:${issuedDate}:D>`,
                    inline: true,
                  },
                  {
                    name: "Reviewed By:",
                    value: `<@${reviewedBy}>`,
                    inline: true,
                  },
                )
                .setFooter({ text: `Record ID: ${record.id} || Powered by Crab` })
             Embeds.push(recordEmbed)
            } 
            await interaction.reply({ embeds: Embeds })
          }
        }
      } else {
        interaction.reply({
          content: "**Insufficient** permissions.",
          flags: MessageFlags.Ephemeral,
        });
      }
        if (subcommand === 'void') {
          if (!(interaction.member.roles.cache.has(hiCommRole) || interaction.member.roles.cache.has(aaRole))) {
          interaction.reply({
            content: "**Insufficient** permissions.",
            flags: MessageFlags.Ephemeral,
          });
          }
        const RecordId = interaction.options.getString("record-id")
        await interaction.reply({ content: `${search} **Fetching** the record...` })
        const response = await interaction.fetchReply();
        const Record = await CrabRecord.findOne({ guildId: interaction.guild.id, id: RecordId })
        if (!Record) {
          return await interaction.editReply({ content: `${x} I was unable to locate a record with that id, please double check the ID and try again.` })
        }
        const confirmDelete = new ButtonBuilder()
        .setCustomId(`crab_button-confirm_delete:${response.id}:${interaction.user.id}:${RecordId}`)
        .setEmoji(check)
        .setLabel("Confirm Delete")
        .setStyle(ButtonStyle.Danger)
         const cancelDelete = new ButtonBuilder()
        .setCustomId(`crab_button-cancel_delete:${response.id}:${interaction.user.id}`)
        .setEmoji(x)
        .setLabel("Cancel Delete")
        .setStyle(ButtonStyle.Secondary)

        const confirmationRow = new ActionRowBuilder().addComponents(confirmDelete, cancelDelete)
        await interaction.editReply({ content: `${check} I was able to locate a record with this id string, would you like to proceed and void the report?\n-# This action is **irreversible**.`, components: [confirmationRow] })
        }
    }
  },
  async autocomplete(interaction, client) {
    MAX_RESULTS = 10
    const focused = interaction.options.getFocused();
    const results = await searchRobloxUsers(focused);
    await interaction.respond(
      results.map(user => ({
        name: user.name,
        value: user.name
      })).slice(0, MAX_RESULTS)
    );
  }
};
