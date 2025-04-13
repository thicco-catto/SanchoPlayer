import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { exec } from "child_process";
import { Guild } from "discord.js";
import { existsSync, unlinkSync } from "fs";
import { promisify } from "util";
import { GetYTDLPPath, GetFFMPEGPath } from "../config";
import { GetCurrentlyPlaying, Next } from "./musicQueues";

const execAsync = promisify(exec);

class VoiceConnectionInfo {
    guildId: string;
    channelId: string;
    voiceConnection: VoiceConnection;
    audioPlayer: AudioPlayer

    constructor(guildId: string, channelId: string, voiceConnection: VoiceConnection, audioPlayer: AudioPlayer) {
        this.guildId = guildId;
        this.channelId = channelId;
        this.voiceConnection = voiceConnection;
        this.audioPlayer = audioPlayer;
    }
}

const voiceConnections: { [guildId: string]: VoiceConnectionInfo } = {}

/**
 * Returns a voice connection for the given guild, if it exists.
 * 
 * @param guildId 
 * @returns 
 */
export function GetVoiceConnection(guildId: string): VoiceConnectionInfo | undefined {
    return voiceConnections[guildId];
}

/**
 * Connects the bot to the given voice channel in the given guild.
 * 
 * @param guild 
 * @param channelId 
 * @param force If force is set to true the bot will leave any other channel it was in before. If set to false (default) the bot won't leave previously joined channels.
 */
export function CreateVoiceConnection(guild: Guild, channelId: string, force = false): VoiceConnectionInfo {
    const existingConn = GetVoiceConnection(guild.id);

    if (existingConn) {
        if (force) {
            DisconnectFromVoice(guild.id);
        } else {
            return existingConn;
        }
    }

    const voiceConnection = NewVoiceConnection(guild, channelId);
    const player = NewAudioPlayer(guild.id);
    voiceConnection.subscribe(player)

    const connInfo = new VoiceConnectionInfo(
        guild.id,
        channelId,
        voiceConnection,
        player
    );
    voiceConnections[guild.id] = connInfo;

    return connInfo;
}

/**
 * Disconnects the bot from the voice channel it joined in the given guild.
 * 
 * @param guildId
 */
export function DisconnectFromVoice(guildId: string) {
    const existingConn = GetVoiceConnection(guildId);
    if (!existingConn) { return; }

    existingConn.voiceConnection.disconnect();
}

export async function PlayNextSong(guildId: string) {
    const connInfo = GetVoiceConnection(guildId);
    if (!connInfo) { return; }

    await new Promise(resolve => setTimeout(resolve, 5))

    const song = GetCurrentlyPlaying(guildId);
    if (!song) { return; }

    if (existsSync(`./music/${guildId}.mp3`)) {
        unlinkSync(`./music/${guildId}.mp3`);
    }

    await execAsync(`${GetYTDLPPath()} -x -q --audio-format mp3 --audio-quality 0 --ffmpeg-location ${GetFFMPEGPath()} -P music -o ${guildId}.%(ext)s ${song.url}`)

    const resource = createAudioResource(`./music/${guildId}.mp3`);
    connInfo.audioPlayer.play(resource);
}

export async function StopPlaying(guildId: string) {
    const connInfo = GetVoiceConnection(guildId);
    if (!connInfo) { return; }

    connInfo.audioPlayer.stop();
}

export async function PausePlayer(guildId: string) {
    const connInfo = GetVoiceConnection(guildId);
    if (!connInfo) { return; }

    connInfo.audioPlayer.pause();
}

export async function UnpausePlayer(guildId: string) {
    const connInfo = GetVoiceConnection(guildId);
    if (!connInfo) { return; }

    connInfo.audioPlayer.unpause();
}


function NewVoiceConnection(guild: Guild, channelId: string): VoiceConnection {
    const voiceConnection = joinVoiceChannel({
        guildId: guild.id,
        channelId: channelId,
        adapterCreator: guild.voiceAdapterCreator
    });

    voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
        voiceConnection.destroy();
        voiceConnections[guild.id].audioPlayer.stop();

        delete voiceConnections[guild.id];
    });

    return voiceConnection;
}

function NewAudioPlayer(guildId: string) {
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause
        }
    });

    player.on(AudioPlayerStatus.Idle, async () => {
        Next(guildId);
        PlayNextSong(guildId);
    });

    return player;
}