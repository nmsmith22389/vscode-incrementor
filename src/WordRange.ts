// TODO: Remove references to hex.

import * as Code from 'vscode';
import * as XRegExp from 'xregexp';
import Adjustment from '~/Adjustment';

// type PlusArray<T> = T | Array<T>;
// type WordRangeGroup = {
//     range: Range;
//     value: string;
// };
// type XRegExpExecArray<P extends string | number | symbol> = RegExpExecArray & Record<P, any>;
// type NumberRegExp = XRegExpExecArray<'number' | 'sign' | 'digits' | 'decimal' | 'suffix'>;
// type HexRegExp = XRegExpExecArray<'red' | 'green' | 'blue'>;

export enum RangeType {
    Hex = 'hex',
    HexGroup = 'hexGroup',
    Number = 'number',
    Enum = 'enum',
}

export default class WordRange {
    public readonly bounds = /[-\w#%.]+/;

    private get editor(): Code.TextEditor {
        return this.adjustment.editor;
    }

    public readonly adjustment: Adjustment;

    public readonly selection: Code.Selection;

    public readonly type?: RangeType;

    public readonly range: Code.Range;

    public readonly value: string = '';

    public readonly groups?: WordRange[];

    public get regex(): RegExp | undefined {
        if (this.type) {
            return this.regexes[this.type];
        }
    }

    private readonly regexes: Record<RangeType, RegExp>;

    // private readonly groupNames: Partial<Record<RangeType, string[]>> = {
    //     hex: ['red', 'green', 'blue'],
    // };

    constructor(adjustment: Adjustment, selection: Code.Range) {
        this.adjustment = adjustment;

        // if (typeof WordRange.textEditor == 'undefined') {
        //     throw new Error('WordRange.textEditor must be set!');
        // }

        this.selection =
            selection instanceof Code.Selection
                ? selection
                : new Code.Selection(selection.start, selection.end);
        this.regexes = this.getRegexPatterns();
        this.range = this.getWordRange();
        this.value = this.getValue();
        this.type = this.getType();
        this.groups = this.getGroups();
    }

    private getRegexPatterns(): Record<RangeType, RegExp> {
        return {
            // TODO: Add support for short hex.
            hex: XRegExp.cache(
                `^
                [#]
                (?<red> [a-fA-F0-9]{2} )
                (?<green> [a-fA-F0-9]{2} )
                (?<blue> [a-fA-F0-9]{2} )
                $`,
                'x'
            ),
            hexGroup: XRegExp.cache(
                `^
                [a-fA-F0-9]{2}
                $`,
                'x'
            ),
            number: XRegExp.cache(
                `^
                (?<number>
                    (?<sign> [-] )?
                    (?<digits> \\d+ )
                    (?: \\. (?<decimals> \\d+ ) )?
                )
                (?<suffix> [a-zA-Z%]* )
                $`,
                'x'
            ),
            enum: XRegExp.cache('^[a-zA-Z](?:-?\\w+)*$'),
        };
    }

    private getWordRange(): Code.Range {
        const range = this.editor.document.getWordRangeAtPosition(
            this.selection.active,
            this.bounds
        );

        if (this.selection.isEmpty && range) {
            return range;
        }

        return this.selection;
        // return new Code.Range(this.selection.start, this.selection.end);
    }

    private getValue(): string {
        return this.editor.document.getText(this.range);
    }

    private getType(): RangeType | undefined {
        let type: RangeType | undefined;

        for (const key in RangeType) {
            const typeToCheck = RangeType[key as keyof typeof RangeType];

            if (this.validate(typeToCheck)) {
                type = typeToCheck;
                break;
            }
        }

        return type;
    }

    private validate(type: RangeType): boolean {
        // if (this.value == undefined) {
        //     return false;
        // }

        switch (type) {
            // case RangeType.Hex:
            //     return this.validateHex();
            // case RangeType.HexGroup:
            //     return this.validateHexGroup();
            case RangeType.Number:
                return this.validateNumber();
            case RangeType.Enum:
                return this.validateEnum();
            default:
                return false;
        }
    }

    private validateHex(): boolean {
        return XRegExp.test(this.value, this.regexes.hex);
    }

    private validateHexGroup(): boolean {
        const wholeRange = this.editor.document.getWordRangeAtPosition(
            this.selection.active,
            this.bounds
        );

        if (wholeRange === undefined) {
            return false;
        }

        const hexValue = this.editor.document.getText(wholeRange);
        const isHex = XRegExp.test(hexValue, this.regexes.hex);

        return (
            isHex &&
            [
                wholeRange.start.character + 1,
                wholeRange.start.character + 1 + 2,
                wholeRange.start.character + 1 + 2 + 2,
            ].includes(this.range.start.character) &&
            XRegExp.test(this.value, this.regexes.hexGroup)
        );
    }

    private validateNumber(): boolean {
        return XRegExp.test(this.value, this.regexes.number);
    }

    private validateEnum(): boolean {
        const test = XRegExp.test(this.value, this.regexes.enum);
        const enums = this.adjustment.config.enums.values;
        const included = enums?.some((e) => e.includes(this.value)) ?? false;

        return test && included;
    }

    // private extractRangeFromValue(valueToExtract: string): Code.Range | undefined {
    //     const startChar = this.value.search(valueToExtract);
    //     const startPos = this.range.start.translate(0, startChar);
    //     const endPos = startPos.translate(0, valueToExtract.length);
    //     const range = new Code.Range(startPos, endPos);

    //     if (startChar < 0 || !this.range.contains(range)) {
    //         return undefined;
    //     }

    //     return range;
    // }

    private getGroups(): WordRange[] | undefined {
        switch (this.type) {
            case RangeType.Hex:
                return this.captureHex();

            default:
                return undefined;
        }
    }

    private captureHex(): WordRange[] | undefined {
        let hex = this.value;
        const groups = [];
        const channels = XRegExp.matchChain(hex, [/[a-fA-F0-9]{2}/]);

        for (const channel of channels) {
            if (hex.search(channel) < 0) {
                return undefined;
            }

            const start = hex.search(channel);
            const end = start + channel.length;
            const range = new Code.Range(
                this.range.start.translate(0, start),
                this.range.start.translate(0, end)
            );

            groups.push(new WordRange(this.adjustment, range));

            hex = XRegExp.replace(hex, channel, '--');
        }

        return groups;
    }
}
