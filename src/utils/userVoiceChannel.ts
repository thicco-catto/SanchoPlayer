import { Guild } from "discord.js";

/**
 * Returns the voice channel a user has joined in the given guild, if any.
 * @param guild 
 * @param userId 
 * @returns 
 */
export async function GetUserVoiceChannel(guild: Guild, userId: string) {
    const channels = await guild.channels.fetch();
    return channels.filter(channel => {
        if (channel === null) { return; }
        if (!channel.isVoiceBased()) { return; }
        
        return channel.members.some(member => member.id === userId);
    }).first();
}