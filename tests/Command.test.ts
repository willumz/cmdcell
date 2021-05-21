import { Command, CommandParameterType } from "../src";

test("Instantiate a command", () => {
    var prefixCmd = new Command(
        "set prefix",
        "setprefix",
        [["prefix", CommandParameterType.STRING]],
        [],
        () => {}
    );
    var cmd = new Command(
        "settings command",
        "settings",
        [["module", CommandParameterType.STRING]],
        [prefixCmd],
        (parameters, cmdtext, props) => {}
    );
    expect(cmd.name).toBe("settings command");
    expect(cmd.command).toBe("settings");
    expect(cmd.parameters.length).toBe(1);
    expect(cmd.parameters[0][0]).toBe("module");
    expect(cmd.parameters[0][1]).toBe(CommandParameterType.STRING);
    expect(cmd.subcommands.length).toBe(1);
    expect(cmd.subcommands[0].name).toBe("set prefix");
});
