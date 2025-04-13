import { Client, GatewayIntentBits, Events, REST, Routes, MessageFlags } from "discord.js";
import { GetAppID, GetDiscordToken } from "./config";
import { Command } from "./commands/command";

let chatCommands: Command[] = [];

export function StartClient() {
    const client = new Client({intents : [GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates]});
    
    client.once(Events.ClientReady, readyClient => {
        console.log(`Bot is now online as ${readyClient.user.tag}`);
    });

    HandleCommands(client);

    client.login(GetDiscordToken());
}

export async function RefreshCommands(commands: Command[]) {
    const rest = new REST().setToken(GetDiscordToken());

    try {
        console.log(`Refreshing ${commands.length} application commands.`);

        const data = await rest.put(
            Routes.applicationCommands(GetAppID()),
            {
                body: commands.map(command => command.commandBuilder.toJSON())
            }
        ) as object[];

        console.log(`Succesfully refreshed ${data.length} application commands.`);

        chatCommands = commands;
    } catch (error) {
        console.error(error);
    }
}

function HandleCommands(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.isChatInputCommand()) {
            let commandName = interaction.commandName
            let foundCommands = chatCommands.filter(command => command.commandBuilder.name === commandName);

            if (foundCommands.length === 0) {
                console.error(`No command matching ${commandName} was found.`);
                return;
            }

            if (foundCommands.length > 1) {
                console.warn(`Multiple commands (${foundCommands.length}) matching ${commandName} were found.`);
            }

            const command = foundCommands[0];

            try {
                await command.toExecute(interaction);
            } catch (error) {
                console.error(error);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral });
                }
            }
        }
    });
}