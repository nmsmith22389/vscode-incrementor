/* eslint-disable import/prefer-default-export */

// eslint-disable-next-line import/no-unassigned-import
import 'module-alias/register';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as Code from 'vscode';
import Incrementor from '~/Incrementor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: Code.ExtensionContext): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const extension = new Incrementor(context);
}

// this method is called when your extension is deactivated
// export function deactivate(): void {}
