import { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { Command } from "./command";
import { Ping } from "./ping";
import { Play } from "./play";
import { CurrentlyPlaying } from "./currentlyplaying";
import { Skip } from "./skip";
import { Pause } from "./pause";
import { Unpause } from "./unpause";
import { Playlist } from "./playlist";
import { Spotify } from "./spotify";

export function CreateCommand(commandBuilder: SlashCommandOptionsOnlyBuilder, toExecute: (interaction: CommandInteraction) => Promise<void>): Command {
    return new Command(commandBuilder, toExecute);
}

export function GetCommands(): Command[] {
    return [
        Ping,
        Play,
        CurrentlyPlaying,
        Skip,
        Pause,
        Unpause,
        Playlist,
        Spotify
    ]
}