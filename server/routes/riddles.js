import { Router } from "express";
import { readDb, writeDb } from "../db/dbHelpers.js";

const router = Router();

router.get("/",async(req,res)=>{
    const data=await readDb();
    res.json(data.riddles)
})

router.get("/:id",async(req,res)=>{
    const data=await readDb();
    const id=Number(req.params.id);
    const riddle=data.riddles.find(riddle=>riddle.id===id)
       if (!riddle) {
        return res.status(404).json({
            message: "Riddle not found"
        });
    }

    res.json(riddle)

})
router.post('/',async(req,res)=>{
    const db=await readDb();
    const newRiddle=req.body;
    const ids = db.riddles.map(riddle => riddle.id);
    const id = Math.max(0,...ids) + 1;
    newRiddle.id=id;
    db.riddles.push(newRiddle)
    await writeDb(db);
    res.status(201).json(newRiddle);
})
router.put("/:id",async(req,res)=>{
    const db=await readDb();
    const id=Number(req.params.id);
    const index=db.riddles.findIndex(riddle=>riddle.id===id);
    if (index === -1) {
        return res.status(404).json({
        error: "Riddle not found"
    });
}
    db.riddles[index]={
        ...req.body,id
    }
    await writeDb(db);
    res.json(db.riddles[index]);
})
router.delete("/:id",async(req,res)=>{
    const db=await readDb();
    const id=Number(req.params.id);
    const riddles=db.riddles
    const index=riddles.findIndex(riddle=>riddle.id===id);
    if(index===-1){
        res.status(404).json({error:"Riddle not found"});
        return;
    }
    riddles.splice(index,1);
    await writeDb(db);
    res.json(db.riddles)
});
export default router;