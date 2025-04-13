import { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export class Command {
    commandBuilder: SlashCommandOptionsOnlyBuilder;
    toExecute: (interaction: CommandInteraction) => Promise<void>;

    constructor(commandBuilder: SlashCommandOptionsOnlyBuilder, toExecute: (interaction: CommandInteraction) => Promise<void>) {
        this.commandBuilder = commandBuilder;
        this.toExecute = toExecute;
    }
}