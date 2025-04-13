import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands";
import { CanVoiceCommandBeUsed } from "../utils/canUseVoiceCommand";
import { GetMusicQueue } from "../handlers/musicQueues";
import { SmartReply } from "../utils/smartReply";
import { MakeWarningEmbed } from "../utils/embeds";

export const Playlist = CreateCommand(
    new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Shows the next songs in the queue."),
    async (interaction: CommandInteraction) => {
        const canBeUsed = await CanVoiceCommandBeUsed(interaction);
        if (!canBeUsed) { return; }

        const guild = interaction.guild!;
        const songs = GetMusicQueue(guild.id);

        if (songs.length === 0) {
            SmartReply(interaction, {
                embeds: [
                    MakeWarningEmbed("There are no songs in the queue")
                ]
            });
            return;
        };

        const embedDescription = songs.slice(0, 10)
            .map((song, index) => `**${index+1}. ${song.title}** - ${song.username}`)
            .join("\n");

        SmartReply(interaction, {
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Blue)
                    .setTitle(`Next ${Math.min(songs.length, 10)} song${songs.length > 1? "s":""} to play`)
                    .setDescription(embedDescription)
            ]
        });
    }
)