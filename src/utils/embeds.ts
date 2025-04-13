import { Colors, EmbedBuilder } from "discord.js";
import { Song } from "../handlers/musicQueues";

/**
 * Creates an embed that shows the user the given message as an error.
 * @param message 
 */
export function MakeErrorEmbed(message: string) {
    return new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Error!")
        .setDescription(message);
}

/**
 * Creates an embed that shows the user the given message as an warning.
 * @param message 
 */
export function MakeWarningEmbed(message: string) {
    return new EmbedBuilder()
        .setColor(Colors.DarkOrange)
        .setTitle(message);
}

export function MakeSucessEmbed(message: string) {
    return new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(message);
}

/**
 * Creates an embed from the given song.
 * @param song 
 */
export function MakeSongEmbed(song: Song) {
    return new EmbedBuilder()
        .setAuthor({
            name: song.username,
            iconURL: song.userAvatar
        })
        .setThumbnail(song.thumbnail)
}