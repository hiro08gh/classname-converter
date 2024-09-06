#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";
import { version } from "../package.json";
import { convertClassToClassName } from "./convertClassToClassName";

program
	.version(version)
	.argument("<target>", "File or folder to refactor")
	.description("class to className converter for jsx")
	.usage(`${chalk.green("classname-converte [FileName|FolderName]")}`)
	.action((target) => {
		convertClassToClassName(target);
	})
	.parse(process.argv);

program.parse();
