import { Message as DiscordMessage } from "discord.js";

// TODO: This

import { Command } from "./Command";

/**
 * Handles parsing messages for commands and their parameters
 *
 */
export class CommandHandler {
    /** The commands to be handled */
    commands: Command[];

    /**
     * An optional function which will be executed every time a message is sent,
     * regardless of whether the message contains a command or not. This could
     * be useful, for example, for levelling purposes.
     *
     * @param message - The original message from the Discord API
     * (see {@link https://discord.js.org/#/docs/main/stable/class/Message Message})
     */
    nonCommand?: (message: DiscordMessage) => void;

    /**
     * The constructor for `CommandHandler` which initialises it with values
     * @param commands - The commands to be handled
     */
    constructor(commands: Command[]) {
        this.commands = commands;
    }
}
