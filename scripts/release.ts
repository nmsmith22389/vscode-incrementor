// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./read-package-json.d.ts" />

import path from 'path';
import cp from 'child_process';
import standardVersion from 'standard-version';
import conventionalRecommendedBump from 'conventional-recommended-bump';
import { SemVer } from 'semver';
import readPkg from 'read-package-json';

class Release {
    async run(): Promise<void> {
        await this.switchToDefaultBranch();

        await this.startReleaseBranch();

        await standardVersion({
            silent: true,
        });

        await this.finishReleaseBranch();
    }

    async switchToDefaultBranch(): Promise<string> {
        return new Promise((resolve, reject) => {
            cp.exec('git checkout develop', (error, stdout) => {
                if (error) {
                    reject(error);
                }

                resolve(stdout);
            });
        });
    }

    async startReleaseBranch(): Promise<string> {
        const nextVersion = await this.getNextVersion();

        return new Promise((resolve, reject) => {
            cp.exec(`git flow release start v${nextVersion}`, (error, stdout) => {
                if (error) {
                    console.error(error);
                    reject(error);
                }

                resolve(stdout);
            });
        });
    }

    async finishReleaseBranch(): Promise<string> {
        return new Promise((resolve, reject) => {
            cp.exec('git flow release finish --notag', (error, stdout) => {
                if (error) {
                    reject(error);
                }

                resolve(stdout);
            });
        });
    }

    async getReleaseType(): Promise<conventionalRecommendedBump.Callback.Recommendation> {
        return new Promise((resolve, reject) => {
            conventionalRecommendedBump(
                {
                    preset: 'angular',
                },
                (error, recommendation) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(recommendation);
                }
            );
        });
    }

    async getCurrentVersion(): Promise<string> {
        return new Promise((resolve, reject) => {
            readPkg(path.join(process.cwd(), 'package.json'), (error, data) => {
                if (error) {
                    reject(error);
                }

                resolve(data.version);
            });
        });
    }

    async getNextVersion(): Promise<string> {
        const currentVersion = await this.getCurrentVersion();
        const recommendation = await this.getReleaseType();
        const version = new SemVer(currentVersion);

        version.inc(recommendation.releaseType ?? 'minor');

        return version.toString();
    }
}

void new Release().run();
