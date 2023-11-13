console.log("Hello world!");

// import chalk from "chalk";
// import { rimrafSync } from "rimraf";
// import { v4 } from "uuid";
// import { spawn } from "child_process";
// import shasum from "shasum";
// import { mkdirSync } from "fs";
// import * as script from "../src/script";
//
// /**
//  * Environment variables and functions for all the tests.
//  */
// const env = {
//   index:
// `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// </head>
// <body>
//   <script src="https://unpkg.com/htmx.org@1.9.8" integrity="sha384-rgjA7mptc2ETQqXoYC3/zJvkU7K/aP44Y+z7xQuJiVnB/422P/Ak+F/AqFR7E4Wr" crossorigin="anonymous"></script>
// </body>
// </html>`,
//   cwd: "./test/env",
//   checksum: (a: string, b: string) => {
//     return shasum(a) === shasum(b);
//   },
//   init: () => {
//     env.end();
//     mkdirSync(env.cwd, { recursive: true });
//   },
//   pass: (name: string) => {
//     console.log(chalk.bold.green("✓"), chalk.green(`Test ${name} passed!`));
//   },
//   fail: (name: string) => {
//     console.log(chalk.bold.green("✗"), chalk.green(`Test ${name} failed!`));
//   },
//   end: () => {
//     rimrafSync(env.cwd);
//   }
// };
//
// const suite: Record<string, () => boolean> = {
//   // tests to
//   properInputSlashes: () => {
//     const answers = {
//       "dir": "./properInput",
//       "cra": false,
//     }
//     const dir = script.confirmInput(answers.dir);
//     // not sure if if(dir) is typesafe :(
//     if(dir === true) {
//
//     }
//   },
//   improperInputSlashes: () => {
//
//   },
//   improperInputDirAlreadyExists: () => {
//
//   },
//   properInputWithoutDeps: () => {
//
//   },
//   properInputWithDeps: () => {
//
//   }
// }
//
// /**
//  * Runs the tests
//  */
// function run() {
//   env.init();
//   for(const key in suite) {
//     const out = suite[key]();
//     if(out) {
//       env.pass(key);
//     } else {
//       env.fail(key);
//     }
//   }
//   env.end();
// }
//
// run();
