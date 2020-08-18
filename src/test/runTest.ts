import * as path from 'path';
import { runTests } from 'vscode-test';

async function main(): Promise<void> {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = process.cwd();

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(extensionDevelopmentPath, './out/test/suite');

        const demoFile = path.resolve(extensionDevelopmentPath, './src/test/demos/demo.js');

        // Download VS Code, unzip it and run the integration test
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: ['--disable-extensions', demoFile],
        });
    } catch (err) {
        console.error(err);
        console.error('Failed to run tests');
        process.exit(1);
    }
}

void main();
