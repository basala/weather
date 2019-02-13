// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "weather" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.weather', function () {
		// The code you place here will be executed every time your command is executed
		const options = {
			ignoreFocusOut: true,
			password: false,
			prompt: "Please type your city (eg.beijing or 北京)"
		};
		vscode.window.showInputBox(options).then((value) => {
			if (value === undefined || value.trim() === '') {
				vscode.window.showInformationMessage('Please type your city.');
			} else {
				const city = value.trim();
				axios.default.get(`https://way.jd.com/he/freeweather?city=${city}&appkey=dacd0df6dd846680d4e88d7c29a202c9`).then((res) => {
					if (res.data.code === '1000') {
						vscode.window.showInformationMessage('Sorry, Please try again.');
						return;
					}
					res.data.result.HeWeather5.forEach(weather => {
						if (weather.status !== 'ok') {
							vscode.window.showInformationMessage(`Sorry, ${weather.status}`);
							return;
						}
						vscode.window.showInformationMessage(`${weather.basic.city}  天气：${weather.now.cond.txt}  空气质量：${weather.aqi.city.aqi}  ${weather.aqi.city.qlty}  PM2.5：${weather.aqi.city.pm25}`);
					});
				}).catch(function (error) {
					vscode.window.showInformationMessage(error);
				})
			}
		});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}