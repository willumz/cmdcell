import {
    Command,
    CommandHandler,
    CommandParameterType,
    ParseErrorInvalidCommand,
    ParseErrorInvalidParameterType,
    ParseErrorMissingParameter,
} from "../src";

// Test `CommandHandler.inferType`
test("Infers the type of 'hello' to be STRING", () => {
    expect(CommandHandler.inferType("hello")).toBe(CommandParameterType.STRING);
});
test("Infers the type of '21' to be NUMBER", () => {
    expect(CommandHandler.inferType("21")).toBe(CommandParameterType.NUMBER);
});
test("Infers the type of 'true' to be BOOLEAN", () => {
    expect(CommandHandler.inferType("true")).toBe(CommandParameterType.BOOLEAN);
});
test("Infers the type of '' to be INVALID", () => {
    expect(CommandHandler.inferType("")).toBe(CommandParameterType.INVALID);
});

// Test `CommandHandler.parseCommand`
test("Parse a simple command correctly", () => {
    // Mock function to be the command run function
    const mockCmdRun = jest.fn((params, text, props) => {
        expect(params.num1).not.toBeNaN();
        expect(params.num2).not.toBeNaN();
        expect(text).toBe("!add 2 3");
        expect(props.client).toBe("client");
    });
    // Define a command
    const cmd = new Command(
        "Add Numbers",
        "add",
        [
            ["num1", CommandParameterType.NUMBER],
            ["num2", CommandParameterType.NUMBER],
        ],
        [],
        mockCmdRun
    );

    // Define command handler
    const cmdHandler = new CommandHandler([cmd], "!");
    // Parse command
    const result = cmdHandler.parseCommand("!add 2 3", { client: "client" });

    // Check it didn't error
    expect(result).toBe(true);
    // Verify the command's `run` function is run
    expect(mockCmdRun.mock.calls.length).toBe(1);
});

// Test instantiation
test("Instantiate CommandHandler", () => {
    const cmd = new Command(
        "Add Numbers",
        "add",
        [
            ["num1", CommandParameterType.NUMBER],
            ["num2", CommandParameterType.NUMBER],
        ],
        [],
        () => {
            return;
        }
    );
    const cmdHandler = new CommandHandler([cmd], "!");
    expect(cmdHandler.prefix).toBe("!");
    expect(cmdHandler.commands[0]).toBe(cmd);
});

// Test errors produced
test("Produce ParseErrorInvalidCommand when the command given to parseCommand is invalid", () => {
    const cmd = new Command(
        "Add Numbers",
        "add",
        [
            ["num1", CommandParameterType.NUMBER],
            ["num2", CommandParameterType.NUMBER],
        ],
        [],
        () => {
            return;
        }
    );
    const cmdHandler = new CommandHandler([cmd], "!");
    const result = cmdHandler.parseCommand("!sub 2 1", {});
    expect(result).toBeInstanceOf(ParseErrorInvalidCommand);
});

test("Produce ParseErrorInvalidParameterType when the parameter type given to a command in parseCommand is invalid", () => {
    const cmd = new Command(
        "Add Numbers",
        "add",
        [
            ["num1", CommandParameterType.NUMBER],
            ["num2", CommandParameterType.NUMBER],
        ],
        [],
        () => {
            return;
        }
    );
    const cmdHandler = new CommandHandler([cmd], "!");
    const result = cmdHandler.parseCommand("!add hello 1", {});
    expect(result).toBeInstanceOf(ParseErrorInvalidParameterType);
});

test("Produce ParseErrorMissingParameter when a parameter is missing in the command given to parseCommand", () => {
    const cmd = new Command(
        "Add Numbers",
        "add",
        [
            ["num1", CommandParameterType.NUMBER],
            ["num2", CommandParameterType.NUMBER],
        ],
        [],
        () => {
            return;
        }
    );
    const cmdHandler = new CommandHandler([cmd], "!");
    const result = cmdHandler.parseCommand("!add 1", {});
    expect(result).toBeInstanceOf(ParseErrorMissingParameter);
});

// Test missing prefix
test("Provide parseCommand with text to parse which does not have the prefix", () => {
    const cmdHandler = new CommandHandler([], "!");
    const result = cmdHandler.parseCommand("hi there", {});
    expect(result).toBe(false);
});

// Test nonCommand runs when a command is parsed successfully
test("Test nonCommand runs when a command is parsed successfully", () => {
    const mockNonCommand = jest.fn((text, props) => {
        expect(text).toBe("!add 1 2");
        expect(props.client).toBe("client");
    });
    const cmd = new Command(
        "Add Numbers",
        "add",
        [
            ["num1", CommandParameterType.NUMBER],
            ["num2", CommandParameterType.NUMBER],
        ],
        [],
        () => {
            return;
        }
    );
    const cmdHandler = new CommandHandler([cmd], "!");
    cmdHandler.setNonCommand(mockNonCommand);
    const result = cmdHandler.parseCommand("!add 1 2", { client: "client" });
    expect(result).toBe(true);
    expect(cmdHandler.nonCommand).toBe(mockNonCommand);
    expect(mockNonCommand.mock.calls.length).toBe(1);
});

// Test nonCommand runs when a command is parsed invalidly
test("Test nonCommand runs when a command is parsed invalidly", () => {
    const mockNonCommand = jest.fn((text, props) => {
        expect(text).toBe("!sub 1 2");
        expect(props.client).toBe("client");
    });
    const cmdHandler = new CommandHandler([], "!");
    cmdHandler.setNonCommand(mockNonCommand);
    const result = cmdHandler.parseCommand("!sub 1 2", { client: "client" });
    expect(result).toBeInstanceOf(ParseErrorInvalidCommand);
    expect(cmdHandler.nonCommand).toBe(mockNonCommand);
    expect(mockNonCommand.mock.calls.length).toBe(1);
});

// Test nonCommand runs when the prefix is not found in text to be parsed
test("Test nonCommand runs when the prefix is not found in text to be parsed", () => {
    const mockNonCommand = jest.fn((text, props) => {
        expect(text).toBe("hello there");
        expect(props.client).toBe("client");
    });
    const cmdHandler = new CommandHandler([], "!");
    cmdHandler.setNonCommand(mockNonCommand);
    const result = cmdHandler.parseCommand("hello there", { client: "client" });
    expect(result).toBe(false);
    expect(cmdHandler.nonCommand).toBe(mockNonCommand);
    expect(mockNonCommand.mock.calls.length).toBe(1);
});
