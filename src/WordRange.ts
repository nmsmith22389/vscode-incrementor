import * as Code from 'vscode';
import * as XRegExp from 'xregexp';
import Adjustment from '~/Adjustment';

export enum RangeType {
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

    public get regex(): RegExp | undefined {
        if (this.type) {
            return this.regexes[this.type];
        }
    }

    private readonly regexes: Record<RangeType, RegExp>;

    constructor(adjustment: Adjustment, selection: Code.Range) {
        this.adjustment = adjustment;
        this.selection =
            selection instanceof Code.Selection
                ? selection
                : new Code.Selection(selection.start, selection.end);
        this.regexes = this.getRegexPatterns();
        this.range = this.getWordRange();
        this.value = this.getValue();
        this.type = this.getType();
    }

    private getRegexPatterns(): Record<RangeType, RegExp> {
        return {
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
        switch (type) {
            case RangeType.Number:
                return this.validateNumber();
            case RangeType.Enum:
                return this.validateEnum();
            default:
                return false;
        }
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
}
