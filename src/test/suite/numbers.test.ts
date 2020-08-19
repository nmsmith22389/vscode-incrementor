import { expect } from 'chai';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as Code from 'vscode';
import CodeInstance, { Command } from './CodeInstance';
import { Settings } from '~/Config';

describe('Numbers', function () {
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

    describe('#incrementByOne()', function () {
        context('before', function () {
            it('should have 1px as selected text', function () {
                codeInstance.selection = new Code.Selection(4, 18, 4, 21);

                expect(codeInstance.getSelectionText()).to.equal('1px');
            });
        });

        context('after', function () {
            it('should increment "1px" to "2px"', async function () {
                await codeInstance.command(Command.INC_BY_ONE, overrides);

                expect(codeInstance.getSelectionText()).to.equal('2px');
            });
        });
    });

    describe('#decrementByOne()', function () {
        context('before', function () {
            it('should have 1px as selected text', function () {
                codeInstance.selection = new Code.Selection(7, 18, 7, 21);

                expect(codeInstance.getSelectionText()).to.equal('1px');
            });
        });

        context('after', function () {
            it('should decrement "1px" to "0px"', async function () {
                await codeInstance.command(Command.DEC_BY_ONE, overrides);

                expect(codeInstance.getSelectionText()).to.equal('0px');
            });
        });
    });

    describe('#incrementByTenth()', function () {
        context('before', function () {
            it('should have 1px as selected text', function () {
                codeInstance.selection = new Code.Selection(10, 20, 10, 23);

                expect(codeInstance.getSelectionText()).to.equal('1px');
            });
        });

        context('after', function () {
            it('should increment "1px" to "1.1px"', async function () {
                await codeInstance.command(Command.INC_BY_TENTH, overrides);

                expect(codeInstance.getSelectionText()).to.equal('1.1px');
            });
        });
    });

    describe('#decrementByTenth()', function () {
        context('before', function () {
            it('should have 1px as selected text', function () {
                codeInstance.selection = new Code.Selection(13, 20, 13, 23);

                expect(codeInstance.getSelectionText()).to.equal('1px');
            });
        });

        context('after', function () {
            it('should decrement "1px" to "0.9px"', async function () {
                await codeInstance.command(Command.DEC_BY_TENTH, overrides);

                expect(codeInstance.getSelectionText()).to.equal('0.9px');
            });
        });
    });

    describe('#incrementByTen()', function () {
        context('before', function () {
            it('should have 1px as selected text', function () {
                codeInstance.selection = new Code.Selection(16, 18, 16, 21);

                expect(codeInstance.getSelectionText()).to.equal('1px');
            });
        });

        context('after', function () {
            it('should increment "1px" to "11px"', async function () {
                await codeInstance.command(Command.INC_BY_TEN, overrides);

                expect(codeInstance.getSelectionText()).to.equal('11px');
            });
        });
    });

    describe('#decrementByTen()', function () {
        context('before', function () {
            it('should have 1px as selected text', function () {
                codeInstance.selection = new Code.Selection(19, 18, 19, 21);

                expect(codeInstance.getSelectionText()).to.equal('1px');
            });
        });

        context('after', function () {
            it('should decrement "1px" to "-9px"', async function () {
                await codeInstance.command(Command.DEC_BY_TEN, overrides);

                expect(codeInstance.getSelectionText()).to.equal('-9px');
            });
        });
    });

    describe('a sticky number', function () {
        context('before', function () {
            it('should have 10 as selected text', function () {
                codeInstance.selection = new Code.Selection(23, 0, 23, 2);

                expect(codeInstance.getSelectionText()).to.equal('10');
            });
        });

        context('after', function () {
            it('should increment 10 to 11', async function () {
                await codeInstance.command(Command.INC_BY_ONE, overrides);

                expect(codeInstance.getSelectionText()).to.equal('11');
            });
        });
    });
});
