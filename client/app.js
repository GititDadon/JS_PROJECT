
import PromptSync from "prompt-sync";
import chalk from "chalk";

import Riddle from "./classes/Riddle.js";
import Player from "./classes/Player.js";

import {
    getAllRiddles,
    createRiddle,
    updateRiddle,
    deleteRiddle
} from "./API/riddlesApi.js";

import {
    createPlayer,
    findPlayerByName,
    getAllPlayers,
    updatePlayer
} from "./API/playersApi.js";

const prompt = PromptSync();

// Show leaderboard
async function viewLeaderBoard() {
    const players = await getAllPlayers();

    const finishedPlayers = players.filter(
        player =>
            typeof player.lowestTime === "number" &&
            Number.isFinite(player.lowestTime) &&
            player.lowestTime > 0
    );

    const sortedPlayers = finishedPlayers.sort(
        (a, b) => a.lowestTime - b.lowestTime
    );

    console.log(chalk.yellowBright("\n🏆 Leaderboard:"));

    if (sortedPlayers.length === 0) {
        console.log("No records yet.");
        return;
    }

    sortedPlayers.forEach((player, index) => {
        console.log(
            `${index + 1}. ${player.name} - ${player.lowestTime} seconds`
        );
    });
}

// Delete an existing riddle
async function deleteExistingRiddle() {
    const id = Number(prompt("Enter Riddle ID to delete: "));

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid riddle ID!");
    }

    await deleteRiddle(id);
}

// Get riddle details from the user
function riddleDetails() {
    const name = prompt("Enter Riddle Name: ").trim();
    const taskDesc = prompt("Enter Riddle Description: ").trim();
    const correctAns = prompt("Enter The Correct Riddle Answer: ").trim();

    const difficultyLevel = prompt(
        "Enter Level Of Difficulty (hard, medium, easy): "
    ).trim().toLowerCase();

    const timeLimit = Number(prompt("Enter Time Limit: "));
    const hint = prompt("Enter a hint: ").trim();

    if (!name || !taskDesc || !correctAns) {
        throw new Error(
            "Riddle name, description and answer are required."
        );
    }

    if (!["hard", "medium", "easy"].includes(difficultyLevel)) {
        throw new Error("Invalid difficulty!");
    }

    if (!Number.isFinite(timeLimit) || timeLimit <= 0) {
        throw new Error("Time limit must be a positive number.");
    }

    return {
        name,
        taskDescription: taskDesc,
        correctAnswer: correctAns,
        difficulty: difficultyLevel,
        timeLimit,
        hint
    };
}

// Create a new riddle
async function createNewRiddle() {
    const riddle = riddleDetails();
    return await createRiddle(riddle);
}

// Read all riddles
async function readAllRiddles() {
    return await getAllRiddles();
}

// Update an existing riddle
async function updateExistingRiddle() {
    const id = Number(
        prompt("Enter the riddle ID you would like to update: ")
    );

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid riddle ID!");
    }

    const riddle = riddleDetails();
    return await updateRiddle(id, riddle);
}

// Play the game
async function playGame() {
    const name = prompt(
        chalk.yellowBright("Welcome Player! What's Your Name? ")
    ).trim();

    if (!name) {
        console.log(chalk.red("Player name cannot be empty!"));
        return;
    }

    // Display difficulty menu separately from prompt
    console.log(
        "\nChoose Difficulty:\n" +
        "1. hard\n" +
        "2. medium\n" +
        "3. easy\n"
    );

    const level = prompt("Enter your difficulty: ").trim();

    let difficulty;

    if (level === "1") {
        difficulty = "hard";
    } else if (level === "2") {
        difficulty = "medium";
    } else if (level === "3") {
        difficulty = "easy";
    } else {
        console.log(chalk.red("Invalid difficulty!"));
        return;
    }

    const player = new Player(name, []);

    // Find or create player in the database
    let dbPlayer;

    try {
        dbPlayer = await findPlayerByName(name);

        if (!dbPlayer) {
            dbPlayer = await createPlayer(name);
            console.log(chalk.green("Welcome new player!"));
        } else if (
            typeof dbPlayer.lowestTime === "number" &&
            dbPlayer.lowestTime > 0
        ) {
            console.log(
                `Your previous record: ${dbPlayer.lowestTime} seconds`
            );
        }
    } catch (error) {
        console.log(chalk.red("Failed to load player:", error.message));
        return;
    }

    // Load riddles from database
    let riddleArray;

    try {
        riddleArray = await getAllRiddles();
    } catch (error) {
        console.log(chalk.red("Could not load riddles:", error.message));
        return;
    }

    const filteredArray = riddleArray.filter(
        riddle => riddle.difficulty === difficulty
    );

    if (filteredArray.length === 0) {
        console.log(chalk.yellow("No riddles available!"));
        return;
    }

    // Play all filtered riddles
    for (const item of filteredArray) {
        const riddle = new Riddle(
            item.id,
            item.name,
            item.taskDescription,
            item.correctAnswer,
            item.difficulty,
            item.timeLimit,
            item.hint
        );

        const total = riddle.ask(prompt);
        player.recordTime(total);
    }

    // Show statistics
    player.showStats();

    // Calculate total game time in seconds
    const totalTime =
        player.times.reduce((x, y) => x + y, 0) / 1000;

    if (!Number.isFinite(totalTime) || totalTime <= 0) {
        console.log(chalk.red("Invalid game time. Record not saved."));
        return;
    }

    // Update the player's best time
    const previousTime = dbPlayer.lowestTime;

    if (
        previousTime === null ||
        previousTime === undefined ||
        previousTime === 0 ||
        totalTime < previousTime
    ) {
        dbPlayer.lowestTime = totalTime;

        try {
            await updatePlayer(dbPlayer);

            console.log(chalk.greenBright(
                `Great job, ${dbPlayer.name}!\n` +
                `Your time: ${totalTime} seconds\n` +
                "New record! Time updated."
            ));
        } catch (error) {
            console.log(chalk.red(
                "Failed to save record:", error.message
            ));
        }
    } else {
        console.log(chalk.yellowBright(
            `Your time: ${totalTime} seconds\n` +
            `Your best time: ${previousTime} seconds\n` +
            "Your previous record remains unchanged."
        ));
    }
}

// Main menu
async function menu() {
    let choice;

    do {
        // Display the menu only once
        console.log(
            "\nWhat do you want to do?\n" +
            "1. Play the game\n" +
            "2. Create new riddle\n" +
            "3. Read all riddles\n" +
            "4. Update an existing riddle\n" +
            "5. Delete a riddle\n" +
            "6. View Leaderboard\n" +
            "0. Exit\n"
        );

        // Prompt only receives the user's choice
        choice = Number(prompt("Enter your choice: "));

        try {
            if (choice === 1) {
                await playGame();
            }

            else if (choice === 2) {
                const newRiddle = await createNewRiddle();
                console.log(chalk.green("Riddle created successfully!"));
                console.log(newRiddle);
            }

            else if (choice === 3) {
                const riddles = await readAllRiddles();
                console.log(riddles);
            }

            else if (choice === 4) {
                const updatedRiddle = await updateExistingRiddle();
                console.log(chalk.green("Riddle updated successfully!"));
                console.log(updatedRiddle);
            }

            else if (choice === 5) {
                await deleteExistingRiddle();
                console.log(chalk.green("Riddle deleted successfully!"));
            }

            else if (choice === 6) {
                await viewLeaderBoard();
            }

            else if (choice === 0) {
                console.log(chalk.yellow("Goodbye!"));
            }

            else {
                console.log(chalk.red("Invalid choice!"));
            }

        } catch (error) {
            console.log(chalk.red("Error:", error.message));
        }

    } while (choice !== 0);
}

await menu();
