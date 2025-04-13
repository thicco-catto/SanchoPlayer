import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands";
import { CanVoiceCommandBeUsed } from "../utils/canUseVoiceCommand";
import { UnpausePlayer } from "../handlers/connections";
import { SmartReply } from "../utils/smartReply";
import { MakeSucessEmbed } from "../utils/embeds";

export const Unpause = CreateCommand(
    new SlashCommandBuilder()
        .setName("unpause")
        .setDescription("Unpauses the music player, if it was paused."),
    async (interaction: CommandInteraction) => {
        const canBeUsed = await CanVoiceCommandBeUsed(interaction);
        if (!canBeUsed) { return; }

        const guild = interaction.guild!;
        UnpausePlayer(guild.id);

        SmartReply(interaction, {
            embeds: [
                MakeSucessEmbed("Successfully unpaused the music player.")
            ]
        });
    }
);