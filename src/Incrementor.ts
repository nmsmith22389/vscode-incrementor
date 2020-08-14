import * as Code from 'vscode';

import Debug from '~/Debug';
import Config from '~/Config';
import Commands from '~/Commands';
// import { upperFirst as _ucFirst } from 'lodash';
// import * as XRegExp from 'xregexp';
// import WordRange from './WordRange';
// import { Settings } from './Settings';
// import { RangeType } from './components/Enums/RangeType';
// import BigNumber from '~/modules/BigNumber';

/**
 * Base Incrementor class.
 */
export default class Incrementor {
    public namespace = 'incrementor';

    public context: Code.ExtensionContext;

    public commands: Commands;

    public config: Config;

    public debug: Debug;

    public get activeTextEditor(): Code.TextEditor | undefined {
        return Code.window.activeTextEditor;
    }

    constructor(context: Code.ExtensionContext) {
        this.context = context;
        this.commands = new Commands(this);
        this.config = new Config(this);
        this.debug = new Debug(this);

        this.activate();
    }

    private activate(): void {
        this.debug.debug('Extension activated.');

        this.commands.register();
    }
}
