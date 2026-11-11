import fs from "node:fs/promises";
const filePath=new URL("./db.json",import.meta.url);

export async function readDb(){
    try{
        const data= await fs.readFile(filePath,"utf8");
         const parseData=JSON.parse(data);
         return parseData;

    }catch(err){
        console.log("Failed to read file.",err.message)
        throw err;

    }
}
export async function writeDb(data){
    const dataString=JSON.stringify(data);
    try{
        await fs.writeFile(filePath,dataString,"utf8");
    }catch(err){
        console.log("Failed to write file.",err.message)
        throw err;
    }
    
}