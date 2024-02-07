<script lang="ts">
 import type IPatientInfo from "../lib/interfaces/IPatientInfo.ts";
 import LargeRoundButton from '../lib/components/atoms/+large_round_button.svelte';
 import LeftPanel from '../lib/components/organisms/+left_panel.svelte';
 import Card from '../lib/components/organisms/+card.svelte';
 import { onMount } from 'svelte';
 import { globalState } from '../stores';
 import { push } from 'svelte-spa-router';

 let currentSearchString = "";
 $: currentPatient = $globalState.currentPatient;
 $: patients = [];

 onMount(async () => {
     try {
         const invoke = window.__TAURI__.invoke;
         const morePatients = await invoke('get_users', {callSource: "sadasd"});
         patients = [...patients, ...morePatients];
     } catch (e) {
         console.error(e);
     }
 });

 $: sortedAndFilteredPatients = patients
     .sort((a, b) => a.name.localeCompare(b.name))
     .filter(patient => patient.name.toLowerCase().includes(currentSearchString.toLowerCase()));

 const getFirstLetter = (name: string) => name[0].toUpperCase();
 let currentlySelectedPatient: string | undefined;
 let isPanelHidden: boolean;

 $: firstLetterMap = sortedAndFilteredPatients.reduce((map: unknown, patient) => {
     const firstLetter = getFirstLetter(patient.name);
     if (!map[firstLetter]) {
         map[firstLetter] = patient.patientId;
     }
     return map;
 }, {});

 const handleSelectUser = (patientId: string) => {
     if (currentlySelectedPatient === patientId) {
         currentlySelectedPatient = undefined;
         setCurrentPatient(null);
     } else {
         currentlySelectedPatient = patientId
         const patient = sortedAndFilteredPatients.find((patient: PatientInfo) => patient.patientId == patientId);

         if ( patient !== undefined )
             setCurrentPatient(patient);
     }
 }    

 function setCurrentPatient(patient: PatientInfo | null) {
     globalState.update(state => {
         state.currentPatient = patient;
         return state;
     });
 }

 const hidePanel = () => {
     if (isPanelHidden) {
         isPanelHidden = false
     } else {
         isPanelHidden = true
     }
 }


 const newPatient = () => {
     push('/new_patient');
 }

 const startRecording = () => {
     hidePanel();
     push('/connect_device');
     globalState.update(state => {
         state.currentStage = 2;
         return state;
     });
 }
</script>

<section class="flex position-absolute flex-row w-full">
    <LeftPanel hidden={isPanelHidden}>
        <section class="panel__header w-full flex flex-col items-center">
            <div class="flex flex-row space-around items-center w-full">
                <h3>Select Patient</h3>
                <div
                    role="button"
                    on:click={() => newPatient()}
                    on:keydown={(e) => (e.key === 'Enter' || e.key === 'Space') && newPatient()}
                    tabindex="0"
                    class="button first-child-is-icon"
                    > <iconify-icon icon="material-symbols:add"/>New Patient
                </div>
            </div>
            <input type="text" placeholder="Search" on:input={(e) => {currentSearchString = e.target.value}} />
        </section>
        {#if patients.length !== 0}
            {#each sortedAndFilteredPatients as {name, patientId, dob, description, gender} (patientId)}
                {#if firstLetterMap[getFirstLetter(name)] === patientId}
                    <div class="sticky-letter-header">{getFirstLetter(name)}</div>
                {/if}
                <Card
                    selected={patientId === currentlySelectedPatient}
                    gender={gender}
                    name={name}
                    patientId={patientId}
                    dob={dob}
                    on:click={(e) => handleSelectUser(patientId)} >
                    {description}
                </Card>
            {/each}
        {:else}
            <h2>No Patients</h2>
        {/if}
    </LeftPanel>
    <main class="content flex flex-col items-center justify-center">
        <LargeRoundButton disabled={currentlySelectedPatient === undefined} on:click={() => startRecording()}>Start Recording</LargeRoundButton>
    </main>

</section>
<style>
 .panel__header{
     --panel-padding-top: 12px;
     position: sticky;
     padding-top: var(--panel-padding-top);
     top: 0;
     z-index: 11;
     background: rgba(240, 240, 240, .3);
     -webkit-backdrop-filter: blur(20px);
     backdrop-filter: blur(20px);
     min-height: 110px; 
 }

 .sticky-letter-header {
     --panel-padding-top: 12px;
     position: sticky;
     top: calc(110px + var(--panel-padding-top));
     z-index: 10;
     border-radius: 0 0 8px 8px;
     color: #FFF;
     background: rgb(120, 120, 255);
     border-radius: 3px;
     padding: 5px 10%;
     margin-bottom: 10px;
     width: 70%;
 }

 .content {
     height: 100vh;
     flex-grow: 1;
     transform: all .1s ease-out;
 }

 .content__patient-info {
     /* min-height: 200px; */
 }

 /* TODO use class */
 input[type="text"] {
     width: 90%;
 }


</style>
