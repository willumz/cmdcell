import {
    CommandParameterType,
    ParseErrorInvalidCommand,
    ParseErrorInvalidParameterType,
    ParseErrorMissingParameter,
} from "../src";

test("Instantiate ParseErrorInvalidParameterType", () => {
    const error = new ParseErrorInvalidParameterType(
        "id",
        "some value",
        CommandParameterType.NUMBER,
        [CommandParameterType.STRING]
    );
    expect(error.parameterName).toBe("id");
    expect(error.parameterValue).toBe("some value");
    expect(error.expectedType).toBe(CommandParameterType.NUMBER);
    expect(error.invalidTypes[0]).toBe(CommandParameterType.STRING);
});

test("Instantiate ParseErrorMissingParameter", () => {
    const error = new ParseErrorMissingParameter("id", CommandParameterType.NUMBER);
    expect(error.parameterName).toBe("id");
    expect(error.parameterType).toBe(CommandParameterType.NUMBER);
});

test("Instantiate ParseErrorInvalidCommand", () => {
    const error = new ParseErrorInvalidCommand();
    expect(error).toBeInstanceOf(ParseErrorInvalidCommand);
});
