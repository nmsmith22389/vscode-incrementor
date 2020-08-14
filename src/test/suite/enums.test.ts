import { expect } from 'chai';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as Code from 'vscode';
import CodeInstance, { Command } from './CodeInstance';
import { Settings } from '~/Config';

describe('Enums', function () {
    this.slow(350);

    const codeInstance = new CodeInstance();

    const overrides: Settings = {
        enabled: true,
        numbers: {
            decimalPlaces: -1,
            ones: {
                incrementValue: 1,
                decrementValue: -1,
            },
            tenths: {
                incrementValue: 0.1,
                decrementValue: -0.1,
            },
            tens: {
                incrementValue: 10,
                decrementValue: -10,
            },
        },
        enums: {
            loop: false,
            values: [['false', 'true']],
        },
    };

    beforeEach(function (done) {
        setTimeout(done, 500);
    });

    describe('incrementing', function () {
        context('before', function () {
            it('should have "false" as selected text', function () {
                codeInstance.selection = new Code.Selection(29, 14, 29, 19);

                expect(codeInstance.getSelectionText()).to.equal('false');
            });
        });

        context('after', function () {
            it('should increment "false" to "true"', async function () {
                await codeInstance.command(Command.INC_BY_ONE, overrides);

                expect(codeInstance.getSelectionText()).to.equal('true');
            });
        });
    });

    describe('decrementing', function () {
        context('before', function () {
            it('should have "true" as selected text', function () {
                codeInstance.selection = new Code.Selection(32, 14, 32, 18);

                expect(codeInstance.getSelectionText()).to.equal('true');
            });
        });

        context('after', function () {
            it('should decrement "true" to "false"', async function () {
                await codeInstance.command(Command.DEC_BY_ONE, overrides);

                expect(codeInstance.getSelectionText()).to.equal('false');
            });
        });
    });

    describe('looping', function () {
        context('off', function () {
            context('before', function () {
                it('should have "true" as selected text', function () {
                    codeInstance.selection = new Code.Selection(36, 15, 36, 19);

                    expect(codeInstance.getSelectionText()).to.equal('true');
                });
            });

            context('after', function () {
                it('should increment "true" to "true"', async function () {
                    const o = Object.assign({}, overrides);

                    o.enums.loop = false;

                    await codeInstance.command(Command.INC_BY_ONE, o);

                    expect(codeInstance.getSelectionText()).to.equal('true');
                });
            });
        });

        context('on', function () {
            context('before', function () {
                it('should have "true" as selected text', function () {
                    codeInstance.selection = new Code.Selection(39, 15, 39, 19);

                    expect(codeInstance.getSelectionText()).to.equal('true');
                });
            });

            context('after', function () {
                it('should increment "true" to "false"', async function () {
                    const o = Object.assign({}, overrides);

                    o.enums.loop = true;

                    await codeInstance.command(Command.INC_BY_ONE, o);

                    expect(codeInstance.getSelectionText()).to.equal('false');
                });
            });
        });
    });
});
