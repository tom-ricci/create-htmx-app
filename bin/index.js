#!/usr/bin/env node
"use strict";
/*

SOME NOTES:
1. This script was originally designed for a bit more than it does, however I really don't feel like spending more time on this than I already have. I have other things I need to do today.
2. That being said, if anyone's interested in finishing the functionality I didn't finish (optionally downloading all of CRA's dependencies for fun, and having unit tests) go for it!
3. Because of npm's horrible commonjs/esm conflicts, I had to do a bit of refactoring to get imports to work. I do not care enough to document what I changed. Honestly, I don't even remember what I had to change. My brain blocked it out. Node.js is traumatic.
4. If this makes your computer explode somehow sorry I just wrote this in a couple hours and did very minimal testing <3 if you want to make a htmx app you really don't need a cli like it's so easy

 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const uuid_1 = require("uuid");
const child_process_1 = require("child_process");
async function script() {
    const { default: inquirer } = await import("inquirer");
    const { default: chalk } = await import("chalk");
    const { default: ora } = await import("ora");
    /**
     * Removes whitespace and leading/trailing path seperators from a string.
     */
    function sanitize(input) {
        input = input.trim();
        input = input.startsWith("./") ? input.replace("./", "") : input;
        input = input.startsWith("/") ? input.replace("/", "") : input;
        input = input.endsWith("/") ? input.replace("/", "") : input;
        return input;
    }
    /**
     * Confirms if the input is valid.
     * @param input
     */
    function confirmInput(input) {
        if (input.includes("/")) {
            return "App directory can only have leading and/or trailing slashes!";
        }
        else if (fs.existsSync(`./${input}/`)) {
            return "App directory already exists and/or is not empty!";
        }
        return true;
    }
    /**
     * Executes the script after the prompts execute.
     */
    function execute(answers, depDir) {
        // i don't trust the filter to actually sanitize the input
        let dir = sanitize(answers["dir"]);
        // add our own leading and trailing slashes. adding them in sanitization would be more efficent but this is already going to be horribly slow given it might download 1500 packages
        dir = `./${dir}/`;
        // this is promise based, so we will execute createApp() in downloadDeps() if we want to install the deps
        if (answers["cra"]) {
            downloadDeps(dir, depDir);
        }
        else {
            createApp(dir);
        }
    }
    inquirer
        .prompt([
        {
            // determines where the app should be installed
            type: "input",
            name: "dir",
            message: `Where do you want to create your ${chalk.bold("<")}${chalk.bold.blue("/")}${chalk.bold(">")} ${chalk.bold("htm")}${chalk.bold.blue("x")} app?`,
            validate(input, answers) {
                sanitize(input);
                // prevent nested directories and make sure the app dir doesn't already exist
                return confirmInput(input);
            },
            filter(input, answers) {
                return sanitize(input);
            }
        }
    ])
        .then((answers) => {
        // we make a random directory to put the CRA deps into if the user wants them
        // oh also this executes the rest of the script too
        execute(answers, (0, uuid_1.v4)());
    })
        .catch((error) => {
        // just some error handling if inquirer doesn't like the environment
        if (error.isTtyError) {
            console.error(error);
            console.log(chalk.bold.red("ERROR: Prompt could not be rendered in the current environment!"));
        }
        else {
            console.error(error);
            console.log(chalk.bold.red("An error occurred!"));
        }
    });
    /**
     * Creates the htmx app.
     * @param location The directory relative to the CWD to install it into.
     */
    function createApp(location) {
        // more spinners!!!
        const spinner = ora(`Installing ${chalk.bold("<")}${chalk.bold.blue("/")}${chalk.bold(">")} ${chalk.bold("htm")}${chalk.bold.blue("x")} app`);
        spinner.color = "blue";
        spinner.start();
        // create app dir and bootstrap an script.html
        fs.mkdirSync(location);
        fs.writeFileSync(`${location}index.html`, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <script src="https://unpkg.com/htmx.org@1.9.8" integrity="sha384-rgjA7mptc2ETQqXoYC3/zJvkU7K/aP44Y+z7xQuJiVnB/422P/Ak+F/AqFR7E4Wr" crossorigin="anonymous"></script>
</body>
</html>`);
        // use a timeout to prevent the spinner from flashing
        setTimeout(() => {
            spinner.stop();
            // we're done!
            console.log(`Done! Your ${chalk.bold("<")}${chalk.bold.blue("/")}${chalk.bold(">")} ${chalk.bold("htm")}${chalk.bold.blue("x")} app is installed!`);
            process.exit(0);
        }, 2000);
    }
    /**
     * Downloads all of CRAs dependencies, and then calls {@link createApp()} once done.
     * @param appDir The directory the htmx app should be installed into.
     */
    function downloadDeps(appDir, id) {
        fs.mkdirSync(`./${id}/`);
        // the package.json of CRA's current deps (nov 12 2023)
        // i am not going to implement logic to go to the internet and download the current deps for a joke. this is good enough
        fs.writeFileSync(`./${id}/package.json`, `{
  "name": "react-deps",
  "dependencies": {
    "chalk": "^4.1.2",
    "commander": "^4.1.1",
    "cross-spawn": "^7.0.3",
    "envinfo": "^7.8.1",
    "fs-extra": "^10.0.0",
    "hyperquest": "^2.1.3",
    "prompts": "^2.4.2",
    "semver": "^7.3.5",
    "tar-pack": "^3.4.1",
    "tmp": "^0.2.1",
    "validate-npm-package-name": "^3.0.0"
  }
}`);
        // install deps
        const ls = (0, child_process_1.spawn)(`cd ./${id}/ && npm i`, {
            cwd: "./"
        });
        // use a spinner to let the user know what's happening
        const spinner = ora("Installing CRA dependencies");
        spinner.color = "blue";
        spinner.start();
        ls.on("close", (code) => {
            // stop spinner, log stopcode, and make app now
            spinner.stop();
            console.log(`CRA dependencies installed (probably)! Stopcode: ${code}`);
            createApp(appDir);
        });
    }
}
script().catch(console.error);
