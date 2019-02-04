import { Timer } from "./timer";
import * as vscode from "vscode";
import { QuickInputButton, Uri } from "vscode";

let statusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Left
);

function displayedMessageWhenOver(name?: string): void {
  if (name) {
    vscode.window.showInformationMessage(
      `Session terminard, ${name} is the new driver! Click on the timer to start your turn`
    );
  }
  vscode.window.showInformationMessage(
    `Session terminated ! Click on the timer to restart`
  );
}

function displayRemainingTime(value: string): void {
  statusBarItem.text = value;
}

export function activate(context: vscode.ExtensionContext) {
  let timer: Timer = new Timer();
  let developers: Array<string> = [];
  let enteredValue: string;

  class MyButton implements QuickInputButton {
    constructor(
      public iconPath: { light: Uri; dark: Uri },
      public tooltip: string
    ) {}
  }

  const addDeveloperButton = new MyButton(
    {
      dark: Uri.file(context.asAbsolutePath("resources/dark/add.svg")),
      light: Uri.file(context.asAbsolutePath("resources/light/add.svg"))
    },
    "Add developer"
  );

  vscode.commands.registerCommand("extension.pauseTimer", () => {
    timer.pauseTimer(vscode.window.showInformationMessage);
  });

  let disposable = vscode.commands.registerCommand(
    "extension.startTimer",
    () => {
      developers = [];
      statusBarItem.command = "extension.pauseTimer";
      statusBarItem.show();
      let inputBox = vscode.window.createInputBox();
      inputBox.title = "Add timing";
      inputBox.placeholder = "Number";
      inputBox.value = "10";
      inputBox.ignoreFocusOut = true;
      inputBox.prompt = `Developers : ${
        developers.length > 0 ? developers.toString() : "none"
      }`;
      inputBox.buttons = [addDeveloperButton];
      // inputBox.shouldResume = shouldResume

      inputBox.onDidAccept(async () => {
        enteredValue = inputBox.value;
        const minimumNumber = parseInt(enteredValue);
        if (isNaN(minimumNumber)) {
          vscode.window.showErrorMessage("You must insert a viable time");
          return;
        }
        if (enteredValue) {
          let time: string = enteredValue;
          timer.initTimer(parseInt(time));
          timer.startTimer(
            developers,
            displayRemainingTime,
            displayedMessageWhenOver
          );
          inputBox.hide();
          developers.length > 0
            ? vscode.window.showInformationMessage(
                `Starting coding session, ${developers[0]} has the keyboard`
              )
            : vscode.window.showInformationMessage(`Starting coding session`);
        }
      });
      inputBox.onDidTriggerButton(item => {
        let devBox = vscode.window.createInputBox();
        devBox.title = "Add dev";
        devBox.placeholder = "name";
        devBox.ignoreFocusOut = true;
        devBox.onDidAccept(async () => {
          const devValue = devBox.value;
          developers.push(devValue);
          inputBox.prompt = `Developers : ${
            developers.length > 0 ? developers.toString() : "none"
          }`;
          inputBox.buttons = [addDeveloperButton];
          inputBox.show();
          devBox.hide();
        });
        devBox.show();
      });
      inputBox.show();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
