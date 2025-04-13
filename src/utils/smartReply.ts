import { CommandInteraction, InteractionReplyOptions, MessagePayload } from "discord.js";

export function SmartReply(interaction: CommandInteraction, options: string | MessagePayload | InteractionReplyOptions) {
    if (interaction.replied || interaction.deferred) {
        interaction.followUp(options);
    } else {
        interaction.reply(options);
    }
}