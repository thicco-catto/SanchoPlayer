import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands";
import { CanVoiceCommandBeUsed } from "../utils/canUseVoiceCommand";
import { GetVoiceConnection, CreateVoiceConnection, PlayNextSong } from "../handlers/connections";
import { EnqueueSpotify, GetMusicQueue } from "../handlers/musicQueues";
import { MakeSongEmbed, MakeWarningEmbed } from "../utils/embeds";
import { SmartReply } from "../utils/smartReply";
import { GetUserVoiceChannel } from "../utils/userVoiceChannel";


export const Spotify = CreateCommand(
    new SlashCommandBuilder()
        .setName("spotify")
        .setDescription("Adds all the songs from a spotify playlist to the queue.")
        .addStringOption(option => option
            .setRequired(true)
            .setName("url")
            .setDescription("URL to the spotify playlist")
        ),
    async (interaction: CommandInteraction) => {
        const canBeUsed = await CanVoiceCommandBeUsed(interaction);
        if (!canBeUsed) { return; }

        const guild = interaction.guild!;
        const spotifyUrl = interaction.options.get("url", true).value as string;

        let connInfo = GetVoiceConnection(guild.id);

        if (!connInfo) {
            const userVoiceChannel = (await GetUserVoiceChannel(guild, interaction.user.id))!;
            connInfo = CreateVoiceConnection(guild, userVoiceChannel.id);
        }

        interaction.deferReply();

        const {song, totalSongs, addedSongs} = await EnqueueSpotify(guild.id, spotifyUrl, interaction.user);

        if (!song) {
            SmartReply(interaction, {
                embeds: [
                    MakeWarningEmbed("Couldn't find any songs from this playlist")
                ]
            });

            return;
        }

        let addedInfo = "All songs from the playlist have been added to the queue.";
        if (totalSongs !== addedSongs) {
            addedInfo = `${addedInfo} out of ${totalSongs} have been added to the queue.`;
        }

        if (GetMusicQueue(guild.id).length === addedSongs) {
            SmartReply(interaction, {
                embeds: [
                    MakeSongEmbed(song)
                        .setDescription(`${addedInfo}\n**${song.title}** will start playing.`)
                        .setColor(Colors.Green)
                ]
            });

            PlayNextSong(guild.id);
        } else {
            SmartReply(interaction, {
                embeds: [
                    new EmbedBuilder()
                        .setDescription(addedInfo)
                        .setColor(Colors.Blue)
                        .setAuthor({
                            name: song.username,
                            iconURL: song.userAvatar
                        })
                ]
            });
        }
    }
);