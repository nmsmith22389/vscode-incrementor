import * as Code from 'vscode';
import { Settings } from '~/Config';

export enum Command {
    INC_BY_ONE = 'incrementByOne',
    DEC_BY_ONE = 'decrementByOne',
    INC_BY_TENTH = 'incrementByTenth',
    DEC_BY_TENTH = 'decrementByTenth',
    INC_BY_TEN = 'incrementByTen',
    DEC_BY_TEN = 'decrementByTen',
}

export default class CodeInstance {
    public get activeTextEditor(): Code.TextEditor | undefined {
        return Code.window.activeTextEditor;
    }

    public get selection(): Code.Selection | undefined {
        return this.activeTextEditor?.selection;
    }

    public set selection(selection: Code.Selection | undefined) {
        if (selection !== undefined && this.activeTextEditor !== undefined) {
            this.activeTextEditor.selection = selection;
        }
    }

    public readonly settings = Code.workspace.getConfiguration(
        'incrementor',
        this.activeTextEditor?.document
    );

    public getSelectionText(): string | undefined {
        return this.activeTextEditor?.document.getText(this.selection);
    }

    public async command(command: Command, overrides?: Settings): Promise<undefined> {
        return Code.commands.executeCommand(`incrementor.${command}`, overrides);
    }
}
