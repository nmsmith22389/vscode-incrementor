// import * as path from 'path';
// import * as fs from 'fs-extra';
import * as Code from 'vscode';
// import {} from 'lodash';
import Incrementor from '~/Incrementor';

export enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR,
}

export enum LogMethod {
    DEBUG = 'log',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

export default class Debug {
    /**
     * The parent extension.
     */
    private extension: Incrementor;

    public get isDev(): boolean {
        return this.extension.context.extensionMode === Code.ExtensionMode.Development;
    }

    constructor(extension: Incrementor) {
        this.extension = extension;
    }

    private post(
        logLevel: LogLevel = LogLevel.INFO,
        message?: any,
        ...optionalParams: any[]
    ): void {
        let logMethod: LogMethod;

        switch (logLevel) {
            case LogLevel.ERROR:
                logMethod = LogMethod.ERROR;
                break;

            case LogLevel.INFO:
                logMethod = LogMethod.INFO;
                break;

            case LogLevel.WARN:
                logMethod = LogMethod.WARN;
                break;

            default:
                logMethod = LogMethod.DEBUG;
                break;
        }

        if (this.isDev) {
            const prefix = 'Figlet Banner: ';
            const params: any[] = [];

            if (typeof message === 'string') {
                params.push(prefix + message);
            } else {
                params.push(prefix, message);
            }

            params.push(...optionalParams);

            console[logMethod](...params);
        }
    }

    /**
     * Post text or items to the debug log.
     *
     * **💡Note:** Only works in development mode.
     */
    public debug(...args: any[]): void {
        this.post(LogLevel.DEBUG, ...args);
    }

    /**
     * Post info text or items to the debug log.
     *
     * **💡Note:** Only works in development mode.
     */
    public info(...args: any[]): void {
        this.post(LogLevel.INFO, ...args);
    }

    /**
     * Post warning text or items to the debug log.
     *
     * **💡Note:** Only works in development mode.
     */
    public warn(...args: any[]): void {
        this.post(LogLevel.WARN, ...args);
    }

    /**
     * Post error text or items to the debug log.
     *
     * **💡Note:** Only works in development mode.
     */
    public error(...args: any[]): void {
        this.post(LogLevel.ERROR, ...args);
    }
}
