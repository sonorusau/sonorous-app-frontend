<script>
 import { onMount } from 'svelte';
 import { globalState } from '../stores';
 import InputTypeText from "../lib/components/molecules/+input_type_text.svelte";
 import InputTypeTextNormal from "../lib/components/molecules/+input_type_text_normal.svelte";
 import Icon from '@iconify/svelte';


 let patientId = '';
 let name = '';
 let dob = '';
 let description = '';
 let conditions = [''];
 let gender = '';


 onMount(async () => {
     try {
         const invoke = window.__TAURI__.invoke
         /* const { invoke } = await import('@tauri-apps/api/tauri'); */
         /* await invoke('my_custom_command'); */
         /* const response = await invoke('my_custom_command'); */
         const userData = { name: "Jane Doe", age: 28, dob: "1993-12-12", gender: "Male" }
         const response = await invoke('save_user', {
             user_data: userData
         });

         const data = await invoke('get_users');
         console.log(response);
     } catch (e) {
         console.error(e);
     }

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

<section class="new-patient always-show-scrollbar">
    <form class="flex flex-col" on:submit|preventDefault={handleSubmit}>
        <h3 class="flex items-center first-child-is-icon">
            <Icon icon="carbon:new-tab" />
            New Patient
        </h3>
        <!-- <InputTypeText icon="fluent:patient-20-filled" placeholder="Patient ID" /> -->
        <InputTypeText icon="fluent:patient-20-filled" placeholder="Name" />

        <h4 for="dob-container" class="flex first-child-is-icon items-center">
            <Icon icon="clarity:date-line" />
            Date of Birth
        </h4>
        <div class="dob-container flex flex-row">
            <InputTypeTextNormal placeholder="DD" />
            <InputTypeTextNormal placeholder="MM" />
            <InputTypeTextNormal placeholder="YYYY" />
        </div>

        <h4 for="description" class="flex items-center first-child-is-icon">
            <Icon icon="fluent:text-description-16-filled" />
            Description
        </h4>
        <textarea id="description" bind:value={description} />

        <h4 for="conditions" class="flex items-center first-child-is-icon">
            <Icon icon="material-symbols:conditions" />
            Conditions
        </h4>

        <div class="input-group">
            {#each conditions as condition, index}
                <div class="condition">
                    <InputTypeTextNormal placeholder="Condition" bind:value={conditions[index]} handleInputChange={(event) => updateCondition(index, event.target.value)} />
                        {#if index !== 0}
                            <button on:click={() => removeCondition(index)}>Remove</button>
                        {/if}
                </div>
            {/each}

            <button type="button" on:click={addCondition}>Add Condition</button>
        </div>

        <h4 for="gender" class="flex items-center first-child-is-icon">
            <Icon icon="healthicons:female-and-male-outline" />
            Gender
        </h4>

        <div class="input-group">
            <input id="gender-male" type="radio" name="gender" value="male" />
            <label for="gender-male">Male</label>
            <input id="gender-female" type="radio" name="gender" value="female" />
            <label for="gender-female">female</label>
        </div>

        <div class="input-group">
            <button on:click={() => console.log("hello")} type="submit">Submit</button>
        </div>

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

 input[type="radio"] + label {
     width: 100%;
     padding: 1em;
     background-color: #f9f9f9;
     border: 1px solid #e5e5e5;
     border-radius: 3px;
     -webkit-transition: 0.35s all ease-in-out;
     transition: 0.35s all ease-in-out;
 }

 .input-group {
 }

 input:focus {
     outline: 0;
     border-color: #bd8200;
 }

 #description {
     width: 100%;
     height: 200px;
     padding: 1em;
     line-height: 1.4;
     background-color: #f9f9f9;
     border: 1px solid #e5e5e5;
     border-radius: 3px;
     margin-right: 4px;
 }


 input[type="radio"] {
     display: none;
 }

 input[type="radio"] + label {
     display: inline-block;
     width: 60px;
     text-align: center;
     color: #888;
     float: left;
     border-radius: 4px;
 }

 input[type="radio"]:checked + label {
     background-color: #f0a500;
     color: #fff;
     border-color: #bd8200;
 }

 #description:focus {
     outline: 0;
     border-color: #bd8200;
 }

 .condition {
     margin-bottom: 10px;
 }

 .dob-container {
     max-width: 240px;
 }

 .always-show-scrollbar {
     -ms-overflow-style: scrollbar;
     scrollbar-width: auto;
     overflow-y: scroll;
 }

 
 .new-patient {
     overflow-y: scroll;
     width: 70%;
     max-width: 700px;
     height: 70%;
 }
 
 
</style>
