<script lang="ts">
 import type IPatientInfo from "../lib/interfaces/IPatientInfo.ts";
 import LargeRoundButton from '../lib/components/atoms/+large_round_button.svelte';
 import LeftPanel from '../lib/components/organisms/+left_panel.svelte';
 import Card from '../lib/components/organisms/+card.svelte';
 import { globalState } from '../stores';

 let currentSearchString = "";

 $: currentPatient = $globalState.currentPatient;

 const patients: PatientInfo[] = [
     {
         "patientId": "33256246",
         "name": "Jane Smith",
         "dob": "22-01-1960",
         "description": "Randomly generated patient data.",
         "conditions": [
             "arthritis"
         ],
         "gender": "Male"
     },
     {
         "patientId": "17630222",
         "name": "Messica Taylor",
         "dob": "06-08-1959",
         "description": "Randomly generated patient data.",
         "conditions": [
             "diabetes"
         ],
         "gender": "Male"
     },
     {
         "patientId": "51541971",
         "name": "Marah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "1234",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },

     {
         "patientId": "12345",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "123456",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "1234567",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "12345678",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "123456789",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "123410",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "123411",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "123412",
         "name": "Zarah Davis",
         "dob": "04-03-1984",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Male"
     },
     {
         "patientId": "78347373",
         "name": "James Wilson",
         "dob": "28-12-1970",
         "description": "Randomly generated patient data.",
         "conditions": [
             "asthma"
         ],
         "gender": "Female"
     },
     {
         "patientId": "62893249",
         "name": "John Doe",
         "dob": "19-04-1959",
         "description": "Randomly generated patient data.",
         "conditions": [
             "anemia"
         ],
         "gender": "Female"
     },
     {
         "patientId": "97346510",
         "name": "John Doe",
         "dob": "09-05-1989",
         "description": "Randomly generated patient data.",
         "conditions": [
             "depression"
         ],
         "gender": "Female"
     },
     {
         "patientId": "62394872",
         "name": "Robert Miller",
         "dob": "10-10-1956",
         "description": "Randomly generated patient data.",
         "conditions": [
             "heart disease"
         ],
         "gender": "Male"
     },
     {
         "patientId": "83997215",
         "name": "Jessica Taylor",
         "dob": "06-06-1948",
         "description": "Randomly generated patient data.",
         "conditions": [
             "malaria"
         ],
         "gender": "Male"
     },
     {
         "patientId": "34695566",
         "name": "James Wilson",
         "dob": "03-06-2003",
         "description": "Randomly generated patient data.",
         "conditions": [
             "COPD"
         ],
         "gender": "Female"
     },
     {
         "patientId": "65702472",
         "name": "Michael Brown",
         "dob": "22-06-1997",
         "description": "Randomly generated patient data.",
         "conditions": [
             "chronic kidney disease"
         ],
         "gender": "Female"
     }
 ]

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


 import { push } from 'svelte-spa-router';

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
                    >
                    <iconify-icon icon="material-symbols:add"/>New Patient
                </div>
            </div>
            <input type="text" placeholder="Search" on:input={(e) => {currentSearchString = e.target.value}} />
        </section>

        {#each sortedAndFilteredPatients as {name, patientId, dob, description, gender} (patientId)}
            {#if firstLetterMap[getFirstLetter(name)] === patientId}
                <div class="sticky-letter-header">{getFirstLetter(name)}</div>
            {/if}
            <Card selected={patientId === currentlySelectedPatient} gender={gender} name={name} patientId={patientId} dob={dob} on:click={(e) => handleSelectUser(patientId)}>
                {description}
            </Card>
        {/each}
    </LeftPanel>
    <main class="content flex flex-col items-center justify-center">
        <section class="content__patient-info flex items-center">
            {#if currentPatient === null}
                <h2>Please Select a Patient to Start Recording</h2>
            {:else}
                {#each sortedAndFilteredPatients as {name, patientId, dob, description, gender} (patientId)}
                    {#if patientId === currentlySelectedPatient}
                        <Card selected={patientId === currentlySelectedPatient} gender={gender} name={name} patientId={patientId} dob={dob} on:click={() => {handleSelectUser(patientId)}}>
                            {description}
                        </Card>
                    {/if}
                {/each}
            {/if}
        </section>
        <LargeRoundButton disabled={currentlySelectedPatient === undefined} on:click={() => startRecording()}>Start Recording</LargeRoundButton>
    </main>

</section>
<style>
 .panel__header{
     position: sticky;
     padding-top: 12px;
     top: 0;
     z-index: 11;
     background: rgba(240, 240, 240, .3);
     -webkit-backdrop-filter: blur(20px);
     backdrop-filter: blur(20px);
     min-height: 110px; 
 }

 .sticky-letter-header {
     position: sticky;
     top: 110px;
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
     min-height: 200px;
 }

 /* TODO use class */
 input[type="text"] {
     width: 90%;
 }


</style>
