/* tslint:disable:ter-prefer-arrow-callback */
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as chai from 'chai';
chai.should();

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as _ from 'lodash';
import {Incrementor} from '../src/extension';

let vEditor: vscode.TextEditor = undefined;
let vDoc: vscode.TextDocument = undefined;
let vSel: vscode.Selection[] = undefined;
let sel: vscode.Selection;
let text: string;

before(function(done) {
    this.timeout(1000); // A very long environment setup.
    setTimeout(done, 500);
});

describe('Actions', function() {
    const inc = new Incrementor();
    describe('incByOne', function() {
        it('should default to 1', function() {
            const action = inc.action.incByOne.toString();
            action.should.equal('1');
        });
    });

    describe('decByOne', function() {
        it('should default to -1', function() {
            const action = inc.action.decByOne.toString();
            action.should.equal('-1');
        });
    });

    describe('incByTenth', function() {
        it('should default to 0.1', function() {
            const action = inc.action.incByTenth.toString();
            action.should.equal('0.1');
        });
    });

    describe('decByTenth', function() {
        it('should default to -0.1', function() {
            const action = inc.action.decByTenth.toString();
            action.should.equal('-0.1');
        });
    });

    describe('incByTen', function() {
        it('should default to 10', function() {
            const action = inc.action.incByTen.toString();
            action.should.equal('10');
        });
    });

    describe('decByTen', function() {
        it('should default to -10', function() {
            const action = inc.action.decByTen.toString();
            action.should.equal('-10');
        });
    });
});

describe('Numbers', function() {
    this.slow(110);
    this.timeout(200);

    beforeEach(function() {
        vEditor = vscode.window.activeTextEditor;
        vDoc = vEditor.document;
        vSel = vEditor.selections;
    });

    describe('#incByOne()', function() {
        it('should have 1px as selected text', function(done) {
            _.delay((done) => {
                sel = new vscode.Selection(4, 18, 4, 21);
                vEditor.selection = sel;
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('1px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });

        it('should increment 1px to 2px', function(done) {
            vscode.commands.executeCommand('incrementor.incByOne');
            _.delay((done) => {
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('2px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });

        describe('a sticky number', function() {
            it('should have 10 as selected text', function(done) {
                _.delay((done) => {
                    sel = new vscode.Selection(22, 0, 22, 2);
                    vEditor.selection = sel;
                    text = vDoc.getText(vEditor.selection);

                    try {
                        text.should.equal('10');
                        done();
                    } catch (error) {
                        done(error);
                    }
                }, 100, done);
            });

            it('should increment 10 to 11', function(done) {
                vscode.commands.executeCommand('incrementor.incByOne');
                _.delay((done) => {
                    text = vDoc.getText(vEditor.selection);

                    try {
                        text.should.equal('11');
                        done();
                    } catch (error) {
                        done(error);
                    }
                }, 100, done);
            });
        });
    });

    describe('#decByOne()', function() {
        it('should have 1px as selected text', function(done) {
            _.delay((done) => {
                sel = new vscode.Selection(7, 18, 7, 21);
                vEditor.selection = sel;
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('1px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });

        it('should increment 1px to 0px', function(done) {
            vscode.commands.executeCommand('incrementor.decByOne');
            _.delay((done) => {
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('0px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });
    });

    describe('#incByTenth()', function() {
        it('should have 1px as selected text', function(done) {
            _.delay((done) => {
                sel = new vscode.Selection(10, 20, 10, 23);
                vEditor.selection = sel;
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('1px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });

        it('should increment 1px to 1.1px', function(done) {
            vscode.commands.executeCommand('incrementor.incByTenth');
            _.delay((done) => {
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('1.1px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });
    });

    describe('#decByTenth()', function() {
        it('should have 1px as selected text', function(done) {
            _.delay((done) => {
                sel = new vscode.Selection(13, 20, 13, 23);
                vEditor.selection = sel;
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('1px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });

        it('should increment 1px to 0.9px', function(done) {
            vscode.commands.executeCommand('incrementor.decByTenth');
            _.delay((done) => {
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('0.9px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });
    });

    describe('#incByTen()', function() {
        it('should have 1px as selected text', function(done) {
            _.delay((done) => {
                sel = new vscode.Selection(16, 18, 16, 21);
                vEditor.selection = sel;
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('1px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });

        it('should increment 1px to 11px', function(done) {
            vscode.commands.executeCommand('incrementor.incByTen');
            _.delay((done) => {
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('11px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });
    });

    describe('#decByTen()', function() {
        it('should have 1px as selected text', function(done) {
            _.delay((done) => {
                sel = new vscode.Selection(19, 18, 19, 21);
                vEditor.selection = sel;
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('1px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });

        it('should increment 1px to -9px', function(done) {
            vscode.commands.executeCommand('incrementor.decByTen');
            _.delay((done) => {
                text = vDoc.getText(vEditor.selection);

                try {
                    text.should.equal('-9px');
                    done();
                } catch (error) {
                    done(error);
                }
            }, 100, done);
        });
    });
});

// describe('Numbers' function() {
//     describe('Increment by one' function() {
//         it('should increment 1 to 2', function() {
//             const origText = vs
//         })
//     })
// })
