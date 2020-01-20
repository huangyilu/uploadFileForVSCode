// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const interaction = require('./src/interaction.js')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // const uploadFile = vscode.commands.registerCommand('extension.uploadFile', () => interaction.uploadFile())
  const uploadFileToMigu = vscode.commands.registerCommand('extension.uploadFileToMigu', () => interaction.uploadFile('migu'))

  // context.subscriptions.push(uploadFile)
  context.subscriptions.push(uploadFileToMigu)
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
