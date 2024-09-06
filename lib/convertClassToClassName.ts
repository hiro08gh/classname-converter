import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { Project, ts } from "ts-morph";

export const convertClassToClassName = (targetPath: string) => {
	if (!fs.existsSync(targetPath)) {
		console.log(chalk.red(`The path ${targetPath} does not exist.`));
		return;
	}

	const project = new Project();
	const stat = fs.statSync(targetPath);

	if (stat.isFile()) {
		processFile(project, targetPath);
	} else if (stat.isDirectory()) {
		processDirectory(project, targetPath);
	} else {
		console.log(chalk.red("Invalid path provided."));
	}
};

const processFile = (project: Project, filePath: string) => {
	const targetExtension = [".jsx", ".tsx", ".js", ".ts"];

	if (targetExtension.includes(path.extname(filePath))) {
		const sourceFile = project.addSourceFileAtPath(filePath);

		for (const attr of sourceFile.getDescendantsOfKind(
			ts.SyntaxKind.JsxAttribute,
		)) {
			if (attr.getNameNode().getText() === "class") {
				const initializer = attr.getInitializer();
				attr.replaceWithText(`className=${initializer?.getText()}`);

				sourceFile.saveSync();
				console.log(
					chalk.green(`Converted 'class' to 'className' in ${filePath}`),
				);
			}
		}
	} else {
		console.log(chalk.yellow(`Skipping non-JSX/TSX file: ${filePath}`));
	}
};

const processDirectory = (project: Project, folderPath: string) => {
	const files = fs.readdirSync(folderPath);

	for (const file of files) {
		const filePath = path.join(folderPath, file);
		const stat = fs.statSync(filePath);

		if (stat.isFile()) {
			processFile(project, filePath);
		} else if (stat.isDirectory()) {
			processDirectory(project, filePath);
		}
	}
};
