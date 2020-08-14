// FIXME: Add support for deprecated options. NOTE: May not actually use/need anymore. Just use deprecated setting for the config warning msg.

import { get as _get } from 'lodash';
import * as Code from 'vscode';
import Incrementor from '~/Incrementor';

// eslint-disable-next-line import/exports-last
export interface SettingsKeys {
    enabled: boolean;
    'numbers.ones.incrementValue': number;
    'numbers.ones.decrementValue': number;
    'numbers.tenths.incrementValue': number;
    'numbers.tenths.decrementValue': number;
    'numbers.tens.incrementValue': number;
    'numbers.tens.decrementValue': number;
    'numbers.decimalPlaces': number;
    'enums.values': string[][];
    'enums.loop': boolean;
}

interface NumbersIncDecValue {
    /**
     * The value to increment a number by.
     */
    incrementValue?: number;

    /**
     * The value to decrement a number by.
     */
    decrementValue?: number;
}

export interface Settings {
    /**
     * Enables or disables Incrementor.
     */
    enabled?: boolean;

    numbers: {
        ones: NumbersIncDecValue;
        tenths: NumbersIncDecValue;
        tens: NumbersIncDecValue;

        /**
         * The number of decimal places to round incremented/decremented decimal
         * numbers to.
         *
         * *(a value of -1 will disable rounding)*
         */
        decimalPlaces?: number;
    };

    enums: {
        /**
         * A group of arrays, each containing a list of enums to cycle through.
         */
        values?: string[][];

        /**
         * After reaching the end of an Enum set or Hex color, start back at the
         * beginning.
         */
        loop?: boolean;
    };
}

export default class Config implements Settings {
    /**
     * The parent extension.
     */
    private extension: Incrementor;

    private overrides?: Settings;

    public get settings(): Code.WorkspaceConfiguration {
        return Code.workspace.getConfiguration(
            this.extension.namespace,
            this.extension.activeTextEditor?.document
        );
    }

    get enabled(): boolean | undefined {
        return this.get('enabled');
    }

    numbers: Settings['numbers'];

    enums: Settings['enums'];

    constructor(extension: Incrementor) {
        this.extension = extension;

        const get = this.get.bind(this);

        this.numbers = {
            ones: {
                get incrementValue(): number | undefined {
                    return get('numbers.ones.incrementValue');
                },
                get decrementValue(): number | undefined {
                    return get('numbers.ones.decrementValue');
                },
            },
            tenths: {
                get incrementValue(): number | undefined {
                    return get('numbers.tenths.incrementValue');
                },
                get decrementValue(): number | undefined {
                    return get('numbers.tenths.decrementValue');
                },
            },
            tens: {
                get incrementValue(): number | undefined {
                    return get('numbers.tens.incrementValue');
                },
                get decrementValue(): number | undefined {
                    return get('numbers.tens.decrementValue');
                },
            },
            get decimalPlaces(): number | undefined {
                return get('numbers.decimalPlaces');
            },
        };

        this.enums = {
            get loop(): boolean | undefined {
                return get('enums.loop');
            },
            get values(): string[][] | undefined {
                return get('enums.values');
            },
        };
    }

    public all(): Settings {
        return {
            enabled: this.get('enabled'),
            numbers: {
                ones: {
                    incrementValue: this.get('numbers.ones.incrementValue'),
                    decrementValue: this.get('numbers.ones.decrementValue'),
                },
                tenths: {
                    incrementValue: this.get('numbers.tenths.incrementValue'),
                    decrementValue: this.get('numbers.tenths.decrementValue'),
                },
                tens: {
                    incrementValue: this.get('numbers.tens.incrementValue'),
                    decrementValue: this.get('numbers.tens.decrementValue'),
                },
            },
            enums: {
                loop: this.get('enums.loop'),
                values: this.get('enums.values'),
            },
        };
    }

    public get<T extends keyof SettingsKeys>(setting: T): SettingsKeys[T] | undefined {
        const override = _get(this.overrides, setting) as SettingsKeys[T] | undefined;
        return override ?? this.settings.get<SettingsKeys[T]>(setting);
    }

    public set<T extends keyof SettingsKeys>(setting: T, value?: SettingsKeys[T]): boolean {
        let successful: boolean;

        try {
            void this.settings.update(setting, value, true);

            successful = true;
        } catch (error) {
            successful = false;
        }

        return successful;
    }

    /**
     * Override set config values without changing the user's settings.
     */
    public setOverrides(overrides: Settings): void {
        this.overrides = Object.assign({}, overrides);
    }

    public getOverrides(): Settings | undefined {
        return this.overrides;
    }

    /**
     * Clear the config overrides.
     */
    public clearOverrides(): void {
        this.overrides = undefined;
    }

    // TODO: Delete if not using anymore.
    // public getDeprecatedSetting<T extends keyof SettingsKeys, I extends boolean = false>(
    //     setting: T,
    //     inspect?: I
    // ):
    //     | (I extends true
    //           ? {
    //                 key: string;

    //                 defaultValue?: SettingsKeys[T];
    //                 globalValue?: SettingsKeys[T];
    //                 workspaceValue?: SettingsKeys[T];
    //                 workspaceFolderValue?: SettingsKeys[T];

    //                 defaultLanguageValue?: SettingsKeys[T];
    //                 globalLanguageValue?: SettingsKeys[T];
    //                 workspaceLanguageValue?: SettingsKeys[T];
    //                 workspaceFolderLanguageValue?: SettingsKeys[T];

    //                 languageIds?: string[];
    //             }
    //           : SettingsKeys[T])
    //     | undefined {
    //     let oldSetting: string | undefined;

    //     switch (setting) {
    //         case 'numbers.ones.incrementValue':
    //             oldSetting = 'incrementByOneValue';
    //             break;
    //         case 'numbers.ones.decrementValue':
    //             oldSetting = 'decrementByOneValue';
    //             break;
    //         case 'numbers.tenths.incrementValue':
    //             oldSetting = 'incrementByTenthValue';
    //             break;
    //         case 'numbers.tenths.decrementValue':
    //             oldSetting = 'decrementByTenthValue';
    //             break;
    //         case 'numbers.tens.incrementValue':
    //             oldSetting = 'incrementByTenValue';
    //             break;
    //         case 'numbers.tens.decrementValue':
    //             oldSetting = 'decrementByTenValue';
    //             break;
    //         case 'numbers.decimalPlaces':
    //             oldSetting = 'decimalPlaces';
    //             break;
    //         case 'enums.values':
    //             oldSetting = 'enums';
    //             break;
    //         case 'enums.loop':
    //             oldSetting = 'loop';
    //             break;
    //         default:
    //             oldSetting = undefined;
    //             break;
    //     }

    //     if (oldSetting === undefined) {
    //         return undefined;
    //     }

    //     return (inspect
    //         ? this.settings.inspect<SettingsKeys[T]>(oldSetting)
    //         : this.settings.get<SettingsKeys[T]>(oldSetting)) as
    //         | (I extends true
    //               ? {
    //                     key: string;

    //                     defaultValue?: SettingsKeys[T];
    //                     globalValue?: SettingsKeys[T];
    //                     workspaceValue?: SettingsKeys[T];
    //                     workspaceFolderValue?: SettingsKeys[T];

    //                     defaultLanguageValue?: SettingsKeys[T];
    //                     globalLanguageValue?: SettingsKeys[T];
    //                     workspaceLanguageValue?: SettingsKeys[T];
    //                     workspaceFolderLanguageValue?: SettingsKeys[T];

    //                     languageIds?: string[];
    //                 }
    //               : SettingsKeys[T])
    //         | undefined;
    // }
}
