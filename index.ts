import { RefreshCommands, StartClient } from "./src/client";
import { GetCommands } from "./src/commands/commands";

console.log("Starting bot");

StartClient();

RefreshCommands(GetCommands());