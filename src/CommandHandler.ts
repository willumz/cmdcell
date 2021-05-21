// TODO: This

import { Command, CommandParameterType } from "./Command";
import { CommandParameters, CommandProps } from "./Types";
import {
    ParseError,
    ParseErrorInvalidCommand,
    ParseErrorInvalidParameterType,
    ParseErrorMissingParameter,
} from "./ParseError";

/**
 * Handles parsing messages for commands and their parameters
 *
 */
export class CommandHandler {
    /** The commands to be handled */
    commands: Command[];

    /**
     * An optional function which will be executed every time a message is parsed,
     * regardless of whether the message contains a command or not. This could
     * be useful, for example, for levelling purposes in a Discord bot.
     *
     * @param props - The variables handed to the command handler when the text is parsed
     */
    nonCommand?: (props: CommandProps) => void;

    /**
     * The constructor for `CommandHandler` which initialises it with values
     * @param commands - The commands to be handled
     */
    constructor(commands: Command[]) {
        this.commands = commands;
    }

    /**
     * Parses the given string through the command handler.
     *
     * @param text - The text to be parsed
     * @param props - Any variables to be passed to the run function
     *
     * @returns True or false, depending on whether the command was successfully parsed
     */
    parseCommand(text: string, props: CommandProps): ParseError | true {
        // Execute nonCommand
        if (this.nonCommand !== undefined) this.nonCommand(props);

        // Split text to parse
        const splitText = text.split(" ");

        let cmd: Command | undefined = undefined;
        let prevCmd: Command | undefined = undefined;
        // Init searchable commands as all commands handled by this handler
        let cmds: Command[] = this.commands;
        let splitTextIndex = 0;
        while (true) {
            cmd = cmds.find(c => c.command === splitText[splitTextIndex]);
            if (cmd !== undefined) {
                // Repeat loop to check for subcommand
                // Prepare for next loop
                splitTextIndex++;
                cmds = cmd.subcommands;
                prevCmd = cmd;
            } else {
                // Invalid command, return to previous command
                cmd = prevCmd;
                splitTextIndex--;
                // Break out of loop as we have found the final command
                break;
            }
        }

        // We now have the command the text is referring to, or undefined
        if (cmd === undefined) return new ParseErrorInvalidCommand();
        // Remove unneeded parent commands
        splitText.splice(0, splitTextIndex);

        // Init object to hold parameters
        const cmdParameters: CommandParameters = {};

        // Iterate through parameters
        cmd.parameters.forEach((val, ind) => {
            // Check parameter exists
            if (splitText.length > ind + 1) {
                // Get parameter type
                const paramType = CommandHandler.inferType(splitText[ind + 1]);
                // Compare types
                if (paramType !== val[1])
                    return new ParseErrorInvalidParameterType(
                        val[0],
                        splitText[ind + 1],
                        val[1],
                        paramType
                    );
                cmdParameters[val[0]] = splitText[ind + 1];
            } else {
                return new ParseErrorMissingParameter(val[0], val[1]);
            }
        });

        cmd.run(cmdParameters, text, props);

        return true;
    }

    /**
     * Infers the type ({@link CommandParameterType}) of a value given.
     * @param value - The value to have its type inferred
     * @returns The inferred type ({@link CommandParameterType.INVALID} if it isn't a valid type)
     * if not type can be inferred.
     */
    static inferType(value: string): CommandParameterType {
        if (value === "false" || value === "true") return CommandParameterType.BOOLEAN;
        if (!isNaN(value as any) && value !== null && value !== "")
            return CommandParameterType.NUMBER;
        if (value !== null && value !== "") return CommandParameterType.STRING;
        return CommandParameterType.INVALID;
    }
}
