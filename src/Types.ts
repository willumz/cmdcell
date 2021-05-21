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
 * An object which holds any variables being passed to a command
 * 
 * key: the provided identifier of the variable
 * 
 * value: the variable
 */
export type CommandProps = {
    [key: string]: any
}

/**
 * The type which is accepted by {@link Command.run} as the code which is executed by the command
 */
export type CommandFunction = {
    /**
     * The body of code which runs for a command
     *
     * @param parameters - The list of parameters the command is passed
     * @param commandtext - The text which was parsed to this command
     * @param props - Any variables passed to this function from the command handler.
     * These can be specified when executing {@link CommandHandler.parseCommand}.
     * e.g. if this is being used for Discord, a you should pass the original
     * {@link https://discord.js.org/#/docs/main/stable/class/Message Message}
     * */
    (parameters: CommandParameters, commandtext: string, props: CommandProps): void;
};
