import { spawn } from "node:child_process";
import { styleText } from "node:util";

const args = process.argv.slice(2);

const tasks = args.map((arg) => spawn("bun", [arg], { stdio: "inherit" }));

tasks.forEach((task) => {
    task.on("close", () => {
        tasks.every((task) => task.kill());
        console.log(styleText("red", "Exiting dev mode!"));
        process.exit(0);
    });
});
