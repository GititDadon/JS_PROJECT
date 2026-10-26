
import chalk from "chalk";

class Riddle {
    constructor(id, name, taskDescription, correctAnswer, difficulty, timeLimit, hint = "") {
        this.id = id;
        this.name = name;
        this.taskDescription = taskDescription;
        this.correctAnswer = correctAnswer;
        this.difficulty = difficulty;
        this.timeLimit = timeLimit;
        this.hint = hint;
    }

    ask(prompt) {
        let start = Date.now();
        let penalty = 0;
        let hintUsed = false;

        console.log(chalk.blueBright(this.taskDescription));

        if (this.hint) {
            console.log(chalk.magentaBright(
                "Type 'hint' for a clue (+10 sec penalty)"
            ));
        }

        let answer = prompt("Your answer: ");

        while (
            answer.trim().toLowerCase() !==
            this.correctAnswer.trim().toLowerCase()
        ) {
            if (answer.trim().toLowerCase() === "hint") {
                if (this.hint && !hintUsed) {
                    console.log(chalk.magentaBright(this.hint));
                    penalty += 10000;
                    hintUsed = true;

                    console.log(chalk.red(
                        "10 seconds penalty applied!"
                    ));
                } else {
                    console.log(chalk.red(
                        "No hint available or hint already used."
                    ));
                }
            } else {
                console.log(chalk.red("Wrong Answer, Try Again!"));
            }

            answer = prompt("Your answer: ");
        }

        let end = Date.now();
        let duration = end - start;

        if (
            Number.isFinite(this.timeLimit) &&
            duration > this.timeLimit * 1000
        ) {
            penalty += 5000;

            console.log(chalk.hex("#FF69B4")(
                "Too Slow! 5 seconds penalty applied!"
            ));
        }

        let total = duration + penalty;

        console.log(chalk.yellow("CORRECT, WELL DONE!!"));

        return total;
    }
}

export default Riddle;
