import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("extension.copyFolderContent", () => {
    vscode.window.showOpenDialog({ canSelectFolders: true }).then((folderUri) => {
      if (folderUri && folderUri[0]) {
        let folderPath = folderUri[0].fsPath;
        let folderContent = getFolderContent(folderPath);
        vscode.env.clipboard.writeText(folderContent).then(() => {
          vscode.window.showInformationMessage("Folder content copied to clipboard!");
        });
      }
    });
  });

  context.subscriptions.push(disposable);
}

function getFolderContent(folderPath: string, level: number = 0): string {
  let folderContent = "";
  let files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    let filePath = path.join(folderPath, file);
    let stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      folderContent += `${" ".repeat(level * 2)}${file}/\n`;
      folderContent += getFolderContent(filePath, level + 1);
    } else {
      let fileContent = fs.readFileSync(filePath, "utf8");
      folderContent += `${" ".repeat(level * 2)}${file}:\n\n\`\`\`\n${fileContent}\n\`\`\`\n\n`;
    }
  });

  return folderContent;
}

export function deactivate() {}
