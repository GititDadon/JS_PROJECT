// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle
import chalk from "chalk";

class Player{
    constructor(name,times){
        this.name=name
        this.times=times
    }
    recordTime(start,end){
        let totalDuration=end-start
        this.times.push(totalDuration)
    }
    showStats(){
        let totalTime=this.times.reduce((x,y)=>x+y)
        let average=totalTime/this.times.length
        console.log(chalk.green(`Total:${totalTime/1000} sec`))
        console.log(chalk.green(`Average:${average/1000} sec`))
        
    }
}
export default Player