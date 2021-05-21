import { Command, CommandHandler, CommandParameterType } from "../src";

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

// TODO: Check CommandHandler instantiates correctly with prefix etc.
