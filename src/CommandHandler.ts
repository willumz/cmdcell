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

    /** The command prefix */
    prefix: string;

    /**
     * An optional function which will be executed every time a message is parsed,
     * regardless of whether the message contains a command or not. This could
     * be useful, for example, for levelling purposes in a Discord bot.
     *
     * @param text - The text which was to be parsed
     * @param props - The variables handed to the command handler when the text is parsed
     */
    nonCommand?: (text: string, props: CommandProps) => void;
    /**
     * Set `nonCommand`
     * @param nonCommand - The command which is always run when something is parsed
     * (see {@link CommandHandler.nonCommand nonCommand})
     */
    setNonCommand(nonCommand: (text: string, props: CommandProps) => void): void {
        this.nonCommand = nonCommand;
    }

    /**
     * The constructor for `CommandHandler` which initialises it with values
     * @param commands - The commands to be handled
     */
    constructor(commands: Command[], prefix: string) {
        this.commands = commands;
        this.prefix = prefix;
    }

    /**
     * Parses the given string through the command handler.
     *
     * @param text - The text to be parsed
     * @param props - Any variables to be passed to the run function
     *
     * @returns True if the command was successfully run, false if no prefix was found,
     * ParseError if an error occurred during the parsing process
     */
    parseCommand(text: string, props: CommandProps): ParseError | true | false {
        // Execute nonCommand
        if (this.nonCommand !== undefined) this.nonCommand(text, props);

        // Check prefix
        if (!text.startsWith(this.prefix)) return false;
        // Remove prefix
        const textNoPrefix = text.replace(this.prefix, "");

        // Split text to parse
        const splitText = textNoPrefix.split(" ");

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
        var errors: ParseError[] = [];
        cmd.parameters.forEach((val, ind) => {
            // Check parameter exists
            if (splitText.length > ind + 1) {
                // Get parameter type
                const paramTypes = CommandHandler.inferType(splitText[ind + 1]);
                // Compare types
                if (!paramTypes.includes(val[1]))
                    errors.push(
                        new ParseErrorInvalidParameterType(
                            val[0],
                            splitText[ind + 1],
                            val[1],
                            paramTypes
                        )
                    );
                cmdParameters[val[0]] = splitText[ind + 1];
            } else {
                errors.push(new ParseErrorMissingParameter(val[0], val[1]));
            }
        });
        if (errors.length > 0) return errors[0];

        cmd.run(cmdParameters, text, props);

        return true;
    }

    /**
     * Infers the possible types ({@link CommandParameterType}) of a value given.
     * @param value - The value to have its type inferred
     * @returns The inferred types ({@link CommandParameterType.INVALID} if it isn't a valid type)
     */
    static inferType(value: string): CommandParameterType[] {
        var types: CommandParameterType[] = [];
        if (value !== null && value !== "") types.push(CommandParameterType.STRING);
        if (value === "false" || value === "true") types.push(CommandParameterType.BOOLEAN);
        if (!isNaN(value as any) && value !== null && value !== "")
            types.push(CommandParameterType.NUMBER);
        if (types.length === 0) types.push(CommandParameterType.INVALID);
        return types;
    }
}
