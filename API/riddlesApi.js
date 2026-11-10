export async function getAllRiddles(){
    const response= await fetch("http://[::1]:3000/riddles");
    if(!response.ok){
        throw new Error("Failed to fetch riddles");

    }
    const data= await response.json();
    return data
}
export async function createRiddle(riddle){
    const response= await fetch("http://[::1]:3000/riddles",{
        method:"POST",
        headers:{"Content-type" : "application/json"},
        body:JSON.stringify(riddle)
    });
    if(!response.ok){
     throw new Error("Failed to create riddle");
    }
    return await response.json()
  
}
export async function updateRiddle(id,riddle){
    const response= await fetch(`http://[::1]:3000/riddles/${id}`,{
        method:"PUT",
        headers:{"Content-type" : "application/json"},
        body: JSON.stringify(riddle)
    });
      if (!response.ok) {
        throw new Error("Failed to update riddle");
    }

    return await response.json();
}
export async function deleteRiddle(id){
        const response= await fetch(`http://[::1]:3000/riddles/${id}`,{
        method:"DELETE",
    });
      if (!response.ok) {
        throw new Error("Failed to delete riddle");
    }

    return await response.json();
}

