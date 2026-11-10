export async function findPlayerByName(name) {
   const response=await fetch(`http://[::1]:3000/players?name=${name}`)
   if(!response.ok){
    throw new Error(`Failed To Find Player`);
   }
   const data=await response.json();
   return data[0]
}
export async function createPlayer(name){
    const response=await fetch(`http://[::1]:3000/players`,{
        method:"POST",
        headers:{"Content-type" : "application/json"},
        body: JSON.stringify({
            name: name,
            lowestTime: null
        })

    });
    if(!response.ok){
    throw new Error(`Failed To Create Player`);
   }
   const data=await response.json();
   return data
}
export async function updatePlayer(player){
    const response=await fetch(`http://[::1]:3000/players/${player.id}`,{
        method:"PUT",
        headers:{"Content-type" : "application/json"},
        
        body: JSON.stringify(player)

    });
    if(!response.ok){
    throw new Error(`Failed To Update Player`);
   }
   const data=await response.json();
   return data
}
export async function getAllPlayers(){
    const response=await fetch(`http://[::1]:3000/players`)
    if(!response.ok){
    throw new Error(`Failed To fetch players`);
   }
   const data=await response.json();
   return data
}