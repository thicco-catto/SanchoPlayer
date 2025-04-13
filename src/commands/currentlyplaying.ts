import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands";
import { CanVoiceCommandBeUsed } from "../utils/canUseVoiceCommand";
import { GetCurrentlyPlaying } from "../handlers/musicQueues";
import { SmartReply } from "../utils/smartReply";
import { MakeSongEmbed, MakeWarningEmbed } from "../utils/embeds";

export const CurrentlyPlaying = CreateCommand(
    new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Displays info about the song that's currently playing"),
    async (interaction: CommandInteraction) => {
        const canBeUsed = await CanVoiceCommandBeUsed(interaction);
        if (!canBeUsed) { return; }

        const guild = interaction.guild!;
        const song = GetCurrentlyPlaying(guild.id);

        if (!song) {
            SmartReply(interaction, {
                embeds: [
                    MakeWarningEmbed("There's nothing playing right now.")
                ]
            });
        } else {
            SmartReply(interaction, {
                embeds: [
                    MakeSongEmbed(song)
                        .setColor(Colors.Blue)
                        .setDescription(`Currently playing **${song.title}**.`)
                ]
            });
        }
    }
)