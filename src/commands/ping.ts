import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { CreateCommand } from "./commands"

export const Ping = CreateCommand(
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pongs back!"),
    async (interaction: CommandInteraction) => {
        interaction.reply("Pong!");
    }
);