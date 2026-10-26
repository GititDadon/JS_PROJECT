import PromptSync from "prompt-sync";
import chalk from "chalk";

import Riddle from "./classes/Riddle.js";
import Player from "./classes/Player.js";
import riddleArray from "./riddles/index.js";

const prompt = PromptSync();

let name = prompt(chalk.yellowBright("Welcome Player! What's Your Name? "));

const level = prompt(
    "Choose Difficulty:\n1. hard\n2. medium\n3. easy\n"
).trim();

let player = new Player(name, []);

// Convert user's choice to difficulty
let difficulty;

if (level === "1") {
    difficulty = "hard";
} else if (level === "2") {
    difficulty = "medium";
} else if (level === "3") {
    difficulty = "easy";
} else {
    console.log(chalk.red("Invalid difficulty!"));
    process.exit(1);
}

const filteredArray = riddleArray.filter(
    riddle => riddle.difficulty === difficulty
);

// Loop through filtered riddles
for (let i in filteredArray) {

    const riddle = new Riddle(
        filteredArray[i].id,
        filteredArray[i].name,
        filteredArray[i].taskDescription,
        filteredArray[i].correctAnswer,
        filteredArray[i].difficulty,
        filteredArray[i].timeLimit,
        filteredArray[i].hint
    );

    const total=riddle.ask(prompt);
    player.recordTime(total)


}

// Show stats only once
player.showStats();