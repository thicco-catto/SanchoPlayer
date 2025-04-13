import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands";
import { CreateVoiceConnection, GetVoiceConnection, PlayNextSong } from "../handlers/connections";
import { CanVoiceCommandBeUsed } from "../utils/canUseVoiceCommand";
import { Enqueue, GetMusicQueue } from "../handlers/musicQueues";
import { SmartReply } from "../utils/smartReply";
import { GetUserVoiceChannel } from "../utils/userVoiceChannel";
import { MakeSongEmbed } from "../utils/embeds";

export const Play = CreateCommand(
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays the given song")
        .addStringOption(option =>
			option
				.setName('song')
				.setDescription('The song to play')
                .setRequired(true)
        ),
    async (interaction) => {
        const canBeUsed = await CanVoiceCommandBeUsed(interaction);
        if (!canBeUsed) { return; }

        const guild = interaction.guild!;
        const songQuery = interaction.options.get("song", true).value as string;

        let connInfo = GetVoiceConnection(guild.id);

        if (!connInfo) {
            const userVoiceChannel = (await GetUserVoiceChannel(guild, interaction.user.id))!;
            connInfo = CreateVoiceConnection(guild, userVoiceChannel.id);
        }

        interaction.deferReply();

        const song = await Enqueue(guild.id, songQuery, interaction.user);

        if (GetMusicQueue(guild.id).length === 1) {
            SmartReply(interaction, {
                embeds: [
                    MakeSongEmbed(song)
                        .setDescription(`**${song.title}** will start playing.`)
                        .setColor(Colors.Green)
                ]
            });

            PlayNextSong(guild.id);
        } else {
            SmartReply(interaction, {
                embeds: [
                    MakeSongEmbed(song)
                        .setDescription(`**${song.title}** has been added to the queue.`)
                        .setColor(Colors.Blue)
                ]
            });
        }
    }
);