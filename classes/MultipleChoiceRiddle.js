import Riddle from "./Riddle.js";
import chalk from "chalk";

export default class MultipleChoice extends Riddle {
    constructor(id, name, taskDescription, correctAnswer, choices) {
        super(id, name, taskDescription, correctAnswer);
        this.choices = choices;
    }

  ask(prompt) {
    console.log(chalk.blueBright(this.taskDescription));

    this.choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}`);
    });

    let answer = prompt("Choose your answer: ");

    while (
        this.choices[Number(answer) - 1]?.trim().toLowerCase() !==
        this.correctAnswer.trim().toLowerCase()
    ) {
        answer = prompt(chalk.red("Wrong, Try Again! "));
    }

    console.log(chalk.yellow("WELL DONE!!"));
}
}