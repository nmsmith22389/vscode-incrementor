import * as Code from 'vscode';
import * as XRegExp from 'xregexp';
// eslint-disable-next-line import/no-named-as-default
import BigNumber from 'bignumber.js';
// import { camelCase as _camelCase } from 'lodash';

import Config, { Settings } from '~/Config';
import Incrementor from '~/Incrementor';
import WordRange, { RangeType } from '~/WordRange';

type XRegExpExecArray<P extends PropertyKey> = RegExpExecArray & Record<P, string>;

type NumberRegExp = XRegExpExecArray<'number' | 'sign' | 'digits' | 'decimal' | 'suffix'>;

export enum AdjustmentDirection {
    DECREMENT = -1,
    INCREMENT = 1,
}

export enum AdjustmentAmount {
    TENTHS,
    ONES,
    TENS,
}

export default class Adjustment {
    private extension: Incrementor;

    public get config(): Config {
        return this.extension.config;
    }

    public delta?: number;

    public direction: AdjustmentDirection;

    public amount: AdjustmentAmount;

    public editor: Code.TextEditor;

    public edit: Code.TextEditorEdit;

    public setting: string;

    static createCommand(
        extension: Incrementor,
        direction: AdjustmentDirection,
        amount: AdjustmentAmount
    ) {
        return (
            textEditor: Code.TextEditor,
            edit: Code.TextEditorEdit,
            configOverrides?: Settings
        ): void => {
            if (configOverrides !== undefined) {
                extension.config.setOverrides(configOverrides);
            } else {
                extension.config.clearOverrides();
            }

            new Adjustment(extension, direction, amount, textEditor, edit);
        };
    }

    constructor(
        extension: Incrementor,
        direction: AdjustmentDirection,
        amount: AdjustmentAmount,
        textEditor: Code.TextEditor,
        edit: Code.TextEditorEdit
    ) {
        this.extension = extension;
        this.direction = direction;
        this.amount = amount;
        this.editor = textEditor;
        this.edit = edit;
        this.setting = this.parseSetting();
        this.delta = this.getDelta();

        this.apply();
    }

    private parseSetting(): string {
        const direction =
            this.direction === AdjustmentDirection.DECREMENT ? 'decrement' : 'increment';
        let amount = '';

        switch (this.amount) {
            case AdjustmentAmount.TENS:
                amount = 'tens';
                break;

            case AdjustmentAmount.TENTHS:
                amount = 'tenths';
                break;

            case AdjustmentAmount.ONES:
            default:
                amount = 'ones';
                break;
        }

        return `numbers.${amount}.${direction}Value`;
        // return _camelCase([direction, 'by', amount, 'value'].join(' '));
    }

    private getDelta(): number | undefined {
        return this.config.get(this.setting as 'numbers.ones.incrementValue');
    }

    private createSelection(range: Code.Range, inverted = false): Code.Selection {
        const anchor = inverted ? range.end : range.start;
        const active = inverted ? range.start : range.end;

        return new Code.Selection(anchor, active);
    }

    private loopArrayIndex(index: number, length: number): number {
        while (index < 0) {
            index += length;
        }
        return index % length;
    }

    private adjustNumber(wordRange: WordRange): string | undefined {
        if (wordRange.regex === undefined) {
            return wordRange.value;
        }

        const regex = XRegExp.exec(wordRange.value, wordRange.regex) as NumberRegExp | null;
        const roundDigits = this.config.numbers.decimalPlaces ?? -1;
        let number = new BigNumber(regex?.number ?? 0);

        number = number.plus(this.delta ?? 0);

        if (roundDigits > -1) {
            number = number.decimalPlaces(roundDigits);
        }

        return number.toString() + (regex?.suffix ?? '');
    }

    private adjustEnum(wordRange: WordRange): string {
        // if (wordRange.value === undefined) {
        //     return wordRange.value;
        // }

        const enums = this.config.enums.values;
        const currentEnum = enums?.find((value) => value.includes(wordRange.value));
        const index = currentEnum?.indexOf(wordRange.value) ?? -1;
        const delta = (this.delta ?? 1) < 0 ? -1 : 1;

        if (index < 0 || currentEnum === undefined) {
            return wordRange.value;
        }

        let nextIndex = index + delta;

        if (this.config.enums.loop) {
            nextIndex = this.loopArrayIndex(nextIndex, currentEnum.length);
        } else {
            nextIndex = nextIndex < currentEnum.length && nextIndex >= 0 ? nextIndex : index;
        }

        return currentEnum[nextIndex];
    }

    public apply(): void {
        this.editor.selections = this.editor.selections.map((selection) => {
            const wordRange = new WordRange(this, selection);
            let result: string | undefined = wordRange.value;

            if (wordRange.type == RangeType.Number) {
                result = this.adjustNumber(wordRange);
            } else if (wordRange.type == RangeType.Enum) {
                result = this.adjustEnum(wordRange);
            }

            if (result !== undefined && result !== wordRange.value && !wordRange.range.isEmpty) {
                this.edit.replace(wordRange.range, result);

                const inverted = !selection.isEmpty && selection.isReversed;

                return this.createSelection(wordRange.range, inverted);
            }

            return selection;
        });
    }
}
