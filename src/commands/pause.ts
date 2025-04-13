import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands";
import { CanVoiceCommandBeUsed } from "../utils/canUseVoiceCommand";
import { PausePlayer } from "../handlers/connections";
import { SmartReply } from "../utils/smartReply";
import { MakeSucessEmbed } from "../utils/embeds";

export const Pause = CreateCommand(
    new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Unpauses the music player, if it was paused."),
    async (interaction: CommandInteraction) => {
        const canBeUsed = await CanVoiceCommandBeUsed(interaction);
        if (!canBeUsed) { return; }

        const guild = interaction.guild!;
        PausePlayer(guild.id);

        SmartReply(interaction, {
            embeds: [
                MakeSucessEmbed("Successfully paused the music player.")
            ]
        });
    }
);