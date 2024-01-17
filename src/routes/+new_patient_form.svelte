<script>
 import { onMount } from 'svelte';
 import { globalState } from '../stores';
 let patientId = '';
 let name = '';
 let dob = '';
 let description = '';
 let conditions = ['']; // Start with an empty condition
 let gender = '';

 onMount(() => {
     globalState.update(state => {
         state.currentStage = 1;
         return state;
     });
 });

 function handleSubmit() {
     const patientData = { patientId, name, dob, description, conditions, gender };
     console.log(patientData); // Handle submission logic here (e.g., send to an API)
 }

 function addCondition() {
     conditions = [...conditions, ''];
 }

 function updateCondition(index, value) {
     conditions[index] = value;
 }

 function removeCondition(index) {
     conditions = conditions.filter((_, i) => i !== index);
 }
</script>

<section class="new-patient">
    <form on:submit|preventDefault={handleSubmit}>
        <label for="patientId">Patient ID:</label>
        <input id="patientId" type="text" bind:value={patientId} />

        <label for="name">Name:</label>
        <input id="name" type="text" bind:value={name} />

        <label for="dob">Date of Birth:</label>
        <input id="dob" type="date" bind:value={dob} />

        <label for="description">Description:</label>
        <textarea id="description" bind:value={description}></textarea>

        <label>Conditions:</label>
        {#each conditions as condition, index}
            <div class="condition">
                <input type="text" bind:value={conditions[index]} on:input={(event) => updateCondition(index, event.target.value)} />
                {#if index !== 0}
                    <button on:click={() => removeCondition(index)}>Remove</button>
                {/if}
            </div>
        {/each}
        <button type="button" on:click={addCondition}>Add Condition</button>

        <label for="gender">Gender:</label>
        <select id="gender" bind:value={gender}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>

        <button type="submit">Submit</button>
    </form>
</section>

<style>
 .new-patient {
     padding: 100px;
     box-sizing: border-box;
     position: absolute;
     animation: fade-in .2s ease-in-out;
     top: 50%;
     left: 50%;
     transform: translateX(-50%) translateY(-50%);
     background: rgba(240, 240, 240, .3);
     border-radius: 12px;
     -webkit-backdrop-filter: blur(20px);
     backdrop-filter: blur(20px);

 }
 /* Add your styles here */
 form {
     /* Form styling */
 }
 .condition {
     margin-bottom: 10px;
 }
</style>
