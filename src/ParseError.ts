import { CommandParameterType } from "./Command";

/**
 * Each instantiated object of this class holds information about an error that occurred during parsing
 * which caused the parse to fail.
 */
export class ParseError {}

/** ParseError returned when a parameter's type is invalid. */
export class ParseErrorInvalidParameterType extends ParseError {
    /** The name of the parameter */
    readonly parameterName: string;
    /** The value of the parameter */
    readonly parameterValue: string;
    /** The expected type */
    readonly expectedType: CommandParameterType;
    /** The invalid potential types which were provided */
    readonly invalidTypes: CommandParameterType[];

    /**
     * @param parameterName - The name of the parameter which was invalid
     * @param parameterValue - The value of the parameter which was invalid
     * @param expectedType - The type expected for the parameter
     * @param invalidTypes - The potential inferred types provided for the parameter
     */
    constructor(
        parameterName: string,
        parameterValue: string,
        expectedType: CommandParameterType,
        invalidTypes: CommandParameterType[]
    ) {
        super();
        this.parameterName = parameterName;
        this.parameterValue = parameterValue;
        this.expectedType = expectedType;
        this.invalidTypes = invalidTypes;
    }
}

/** ParseError returned when a parameter is missing. */
export class ParseErrorMissingParameter extends ParseError {
    /** The name of the missing parameter */
    readonly parameterName: string;
    /** The type of the missing parameter */
    readonly parameterType: CommandParameterType;
    /**
     * @param parameterName - The name of the missing parameter
     * @param parameterType - The type of the missing parameter
     */
    constructor(parameterName: string, parameterType: CommandParameterType) {
        super();
        this.parameterName = parameterName;
        this.parameterType = parameterType;
    }
}

/** ParseError returned when a command does not exist. */
export class ParseErrorInvalidCommand extends ParseError {
    constructor() {
        super();
    }
}
