import { CommandFunction } from "./Types";

/**
 * An enumerator of the different valid parameter types for commands
 */
export enum CommandParameterType {
    /** The type corresponding to `string` */
    STRING,
    /** The type corresponding to `number` */
    NUMBER,
    /** The type corresponding to `boolean` */
    BOOLEAN,
    /** Invalid type - could not be parsed to a valid type */
    INVALID
}

/**
 * This class holds information about a command
 */
export class Command {
    /** The name of the command */
    name: string;
    /** The phrase which invokes the command e.g. in `!help`, `help` would be the command */
    command: string;

    /** A list of subcommands which the command has e.g. `!command subcommand params` */
    parameters: [string, CommandParameterType][];
    /** A list of subcommands which the command has e.g. `!command subcommand params` */
    subcommands: Command[];

    /** The body of code which runs for a command */
    run: CommandFunction;

    /**
     * The constructor for `Command` which initialises the class with values.
     *
     * Note that *either* `parameters` or `subcommands` should be populated ideally.
     * If both contain values, subcommands are prioritised.
     *
     * @param name - The name of the command
     * @param command - The phrase which invokes the command e.g. in `!help`, `help` would be the command
     * @param parameters - A list of parameters which the command takes
     * @param subcommmands - A list of subcommands which the command has e.g. `!command subcommand params`
     * @param run - The body of code which runs for the command
     */
    constructor(
        name: string,
        command: string,
        parameters: [string, CommandParameterType][],
        subcommmands: Command[],
        run: CommandFunction
    ) {
        this.name = name;
        this.command = command;
        this.parameters = parameters;
        this.subcommands = subcommmands;
        this.run = run;
    }
}
