import { CommandHandler, CommandParameterType } from "../src";

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
