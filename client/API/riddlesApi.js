
const BASE_URL = "http://127.0.0.1:3000/api/riddles";

// GET - Read all riddles
export async function getAllRiddles() {
    try {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch riddles: ${response.status}`
            );
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching riddles:", error);
        throw error;
    }
}

// POST - Create a new riddle
export async function createRiddle(riddle) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(riddle)
        });

        if (!response.ok) {
            throw new Error(
                `Failed to create riddle: ${response.status}`
            );
        }

        return await response.json();

    } catch (error) {
        console.error("Error creating riddle:", error);
        throw error;
    }
}

// PUT - Update an existing riddle
export async function updateRiddle(id, riddle) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(riddle)
        });

        if (!response.ok) {
            throw new Error(
                `Failed to update riddle: ${response.status}`
            );
        }

        return await response.json();

    } catch (error) {
        console.error("Error updating riddle:", error);
        throw error;
    }
}

// DELETE - Delete a riddle
export async function deleteRiddle(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(
                `Failed to delete riddle: ${response.status}`
            );
        }

        return await response.json();

    } catch (error) {
        console.error("Error deleting riddle:", error);
        throw error;
    }
}
