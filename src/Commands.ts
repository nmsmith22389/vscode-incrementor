import * as Code from 'vscode';

import Debug from '~/Debug';
import Config from '~/Config';
import Incrementor from '~/Incrementor';
import Adjustment, { AdjustmentDirection, AdjustmentAmount } from '~/Adjustment';

export type CommandList = Record<string, (...args: any[]) => any>;

export default class Commands {
    /**
     * The parent extension.
     */
    private extension: Incrementor;

    private get debug(): Debug {
        return this.extension.debug;
    }

    private get config(): Config {
        return this.extension.config;
    }

    /**
     * An object where the keys correspond to a command name *(without
     * namespace)* and the command method.
     */
    private get commandList(): CommandList {
        return {
            incrementByOne: Adjustment.createCommand(
                this.extension,
                AdjustmentDirection.INCREMENT,
                AdjustmentAmount.ONES
            ),
            decrementByOne: Adjustment.createCommand(
                this.extension,
                AdjustmentDirection.DECREMENT,
                AdjustmentAmount.ONES
            ),
            incrementByTenth: Adjustment.createCommand(
                this.extension,
                AdjustmentDirection.INCREMENT,
                AdjustmentAmount.TENTHS
            ),
            decrementByTenth: Adjustment.createCommand(
                this.extension,
                AdjustmentDirection.DECREMENT,
                AdjustmentAmount.TENTHS
            ),
            incrementByTen: Adjustment.createCommand(
                this.extension,
                AdjustmentDirection.INCREMENT,
                AdjustmentAmount.TENS
            ),
            decrementByTen: Adjustment.createCommand(
                this.extension,
                AdjustmentDirection.DECREMENT,
                AdjustmentAmount.TENS
            ),
        };
    }

    constructor(extension: Incrementor) {
        this.extension = extension;
    }

    /**
     * Register all of the extension's commands.
     */
    public register(): void {
        this.debug.debug('Registering commands...');

        Object.entries(this.commandList).forEach((args) => this.registerCommand(...args));
    }

    /**
     * Register a command for the extension.
     */
    private registerCommand(name: string, method: (...args: any[]) => any): void {
        const disposable = Code.commands.registerTextEditorCommand(
            `${this.extension.namespace}.${name}`,
            method,
            this
        );

        this.extension.context.subscriptions.push(disposable);

        this.debug.debug(`Command registered: '${name}'.`);
    }

    protected notImplemented(): void {
        void Code.window.showInformationMessage('Command Not Implemented Yet!');
    }
}
