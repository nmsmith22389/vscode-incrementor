/**
 * @type {import('prettier').ParserOptions}
 */
const config = {
    /*
     *     __
     *    /__  _  ._   _  ._ _. |
     *    \_| (/_ | | (/_ | (_| |
     */

    printWidth: 100,
    // printWidth: 120,

    tabWidth: 4,

    useTabs: false,

    semi: true,

    singleQuote: true,

    quoteProps: 'as-needed',

    jsxSingleQuote: false,

    trailingComma: 'es5',

    bracketSpacing: true,

    jsxBracketSameLine: false,

    arrowParens: 'always',

    rangeStart: 0,

    rangeEnd: Infinity,

    // parser: null,

    // filepath: null,

    requirePragma: false,

    insertPragma: false,

    proseWrap: 'preserve',

    htmlWhitespaceSensitivity: 'css',

    endOfLine: 'lf',
};

module.exports = config;
