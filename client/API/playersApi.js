
const BASE_URL = "http://localhost:3000/api/players";

// Find player by name
export async function findPlayerByName(name) {
    const response = await fetch(
        `${BASE_URL}?name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
        throw new Error("Failed To Find Player");
    }

    const data = await response.json();
    return data;
}

// Create a new player
export async function createPlayer(name) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            lowestTime: null
        })
    });

    if (!response.ok) {
        throw new Error("Failed To Create Player");
    }

    const data = await response.json();
    return data;
}

// Update player
export async function updatePlayer(player) {
    const response = await fetch(`${BASE_URL}/${player.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
    });

    if (!response.ok) {
        throw new Error("Failed To Update Player");
    }

    const data = await response.json();
    return data;
}

// Get all players
export async function getAllPlayers() {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("Failed To Fetch Players");
    }

    const data = await response.json();
    return data;
}
