
<script context="module">
	export async function preload(page, session) {

		const res = await this.fetch(`/vegetableslist`);
		const vegetables = await res.json();

		return { vegetables };
	}
</script>

<script>
    /*let vegetables = [{
        "name":"Peas",
        "description":"Peas are very tasty when well cooked.",
        "picture":"/peas.jpg",
        "picalt":"Showing peas"
    },
    {
        "name":"Tomato",
        "description":"Delicious on pizza.",
        "picture":"/tomato.jpg",
        "picalt":"Showing tomato plant"
    },
    {
        "name":"Patato",
        "description":"Great for French fries.",
        "picture":"/patato.jpg",
        "picalt":"Showing patato plant"
    }];*/
    export let vegetables;
    let newName;
    let newDescription;

    async function createNewVeg(){
        const res = await fetch(`/newveg`,{
            method:"POST",
            body:JSON.stringify({
                name:newName,
                description : newDescription
            })
        });
        vegetables = await res.json();
        newName = "";
        newDescription = "";
    }

    function deleteMe(id){
        return async function(){
            const res = await fetch(`/deleteveg/`+ id ,{
            method:"DELETE"
        });
        vegetables = await res.json();
        }
    }
</script>

<style>
    
</style>



<h1 class="text-3xl text-green-800 font-black font-sans uppercase leading-loose">Vegetables you can plant</h1>
<div class="space-y-3"> 
    {#each vegetables as veg}
        <div class="flex border-green-300 border-2 rounded-lg p-3 space-x-3">
            <div class="w-1/4">
                <img class="rounded-lg" src={veg.picture} alt={veg.picalt}/> 
            </div>
            <div class="w-3/4">
                <h3 class="uppercase text-lg font-bold text-green-600">{veg.name}</h3>
                <p>{veg.description}.</p>
                <div on:click={deleteMe(veg._id)}>Delete</div>
            </div>
        </div> 
    {/each}
    <div class="flex border-green-300 border-2 rounded-lg p-3 space-x-3">
            <div class="w-1/4">
                <img class="rounded-lg" src="question.png" alt="Add a veg"/> 
            </div>
            <div class="w-3/4">
                <form on:submit|preventDefault={createNewVeg}>
                    <div><span>Name :</span><input type="text" bind:value={newName}/></div>
                    <div><span>Description : </span><input type="text" bind:value={newDescription}/></div>
                    <input type="submit"/>
                </form>
            </div>
    </div> 
</div>