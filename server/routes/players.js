
import { Router } from "express";
import { readDb, writeDb } from "../db/dbHelpers.js";

const router = Router();

router.get("/", async (req, res) => {
    const db = await readDb();
    const name = req.query.name;

    if (name) {
        const player = db.players.find(
            player => player.name === name
        );

        return res.json(player ?? null);
    }

    res.json(db.players);
});

router.post("/", async (req, res) => {
    const db = await readDb();

    const player = {
        id: Date.now(),
        name: req.body.name,
        lowestTime: null
    };

    db.players.push(player);

    await writeDb(db);

    res.status(201).json(player);
});

// PUT - Update player's best time
router.put("/:id", async (req, res) => {
    const db = await readDb();
    const id = Number(req.params.id);

    const index = db.players.findIndex(
        player => player.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Player not found"
        });
    }

    const oldTime = db.players[index].lowestTime;
    const newTime = req.body.lowestTime;

    if (
        typeof newTime !== "number" ||
        !Number.isFinite(newTime) ||
        newTime < 0
    ) {
        return res.status(400).json({
            error: "Invalid lowestTime"
        });
    }

    const bestTime = oldTime === null
        ? newTime
        : Math.min(oldTime, newTime);

    const player = {
        ...db.players[index],
        lowestTime: bestTime,
        id
    };

    db.players[index] = player;

    await writeDb(db);

    res.status(200).json(player);
});

export default router;
