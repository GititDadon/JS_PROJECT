// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.
import PromptSync from 'prompt-sync';
import chalk from "chalk"
const prompt = PromptSync();
import Riddle from './classes/Riddle.js'
import Player from './classes/Player.js'
import riddleArray from './riddles/index.js'

let name=prompt(chalk.yellowBright(`Welcome Player! What's Your Name? `))
let player=new Player(name,[])
let start,end=0
for(let i in riddleArray){
    start=Date.now()
    const riddle=new Riddle(riddleArray[i].id,riddleArray[i].name,riddleArray[i].taskDescription,riddleArray[i].correctAnswer)
    riddle.ask(prompt)
    end=Date.now()
    player.recordTime(start,end)
    player.showStats()
}