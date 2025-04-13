import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands";
import { CanVoiceCommandBeUsed } from "../utils/canUseVoiceCommand";
import { GetVoiceConnection, StopPlaying } from "../handlers/connections";
import { MakeWarningEmbed } from "../utils/embeds";
import { SmartReply } from "../utils/smartReply";
import { GetCurrentlyPlaying, Next } from "../handlers/musicQueues";

export const Skip = CreateCommand(
    new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the song that's currently playing."),
    async (interaction: CommandInteraction) => {
        const canBeUsed = await CanVoiceCommandBeUsed(interaction);
        if (!canBeUsed) { return; }

        const guild = interaction.guild!;

        let connInfo = GetVoiceConnection(guild.id);
        const song = GetCurrentlyPlaying(guild.id);

        if (!connInfo || !song) {
            SmartReply(interaction, {
                embeds: [
                    MakeWarningEmbed("There's nothing playing right now.")
                ]
            });

            return
        } 

        StopPlaying(guild.id);

        SmartReply(interaction, {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Song succesfully skipped.")
                    .setColor(Colors.Green)
            ]
        });
    }
)