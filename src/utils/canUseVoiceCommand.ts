import { CommandInteraction, MessageFlags } from "discord.js";
import { GetUserVoiceChannel } from "./userVoiceChannel";
import { GetVoiceConnection } from "../handlers/connections";
import { MakeErrorEmbed } from "./embeds";
import { SmartReply } from "./smartReply";

/**
 * Checks if a voice command can be used from the given interaction.
 * 
 * Will automatically reply with an error embed if the command can't be used.
 * 
 * @param interaction 
 */
export async function CanVoiceCommandBeUsed(interaction: CommandInteraction): Promise<boolean> {
    const guild = interaction.guild;
    if (!guild) {
        SmartReply(interaction, {
            embeds: [ MakeErrorEmbed("You can only use this command from a server.") ],
            flags: MessageFlags.Ephemeral
        });
        return false;
    }

    const userVoiceChannel = await GetUserVoiceChannel(guild, interaction.user.id);    
    if(!userVoiceChannel) {
        SmartReply(interaction, {
            embeds: [ MakeErrorEmbed("You need to be in a voice channel to use this command.")],
            flags: MessageFlags.Ephemeral
        });
        return false;
    }

    let connInfo = GetVoiceConnection(guild.id);
    if (connInfo && connInfo.channelId !== userVoiceChannel.id) {
        SmartReply(interaction, {
            embeds: [ MakeErrorEmbed("The bot is connected to a different channel.")],
            flags: MessageFlags.Ephemeral
        });
        return false;
    }

    return true;
}
