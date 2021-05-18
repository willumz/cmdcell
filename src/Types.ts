import { Message as DiscordMessage } from "discord.js";

/**
 * An object which holds the values for parameters for a command
 *
 * key: the name of the parameter
 *
 * value: the value of the parameter
 */
export type CommandParameters = {
    [key: string]: any;
};

/**
 * The type which is accepted by {@link Command.run} as the code which is executed by the command
 */
export type CommandFunction = {
    /**
     * The body of code which runs for a command
     *
     * @param parameters - The list of parameters the command is passed
     * @param message - The original message from the Discord API
     * (see {@link https://discord.js.org/#/docs/main/stable/class/Message Message})
     * */
    (parameters: CommandParameters, message: DiscordMessage): void;
};
