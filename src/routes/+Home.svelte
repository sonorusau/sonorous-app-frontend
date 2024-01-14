<script lang="ts">
 export let name;
 import LargeRoundButton from '../lib/components/atoms/+large_round_button.svelte';
 import LeftPanel from '../lib/components/organisms/+left_panel.svelte';
 import Card from '../lib/components/organisms/+card.svelte';

 let currentSelectPatient;
 let currentSearchString = "";

 const patients = [
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

 const getFirstLetter = (name) => name[0].toUpperCase();

 let currentlySelectedPatient;

 $: if (currentlySelectedPatient) {
     console.log(currentlySelectedPatient);
 }

 $: firstLetterMap = sortedAndFilteredPatients.reduce((map, patient) => {
     const firstLetter = getFirstLetter(patient.name);
     if (!map[firstLetter]) {
         map[firstLetter] = patient.patientId;
     }
     return map;
 }, {});
</script>

<body class="flex flex-row">
    <LeftPanel>
        <h3>Select Patient</h3>
        <input type="text" placeholder="Search" on:input={(e) => {currentSearchString = e.target.value}} />
        {#each sortedAndFilteredPatients as {name, patientId, dob} (patientId)}
            {#if firstLetterMap[getFirstLetter(name)] === patientId}
                <div class="sticky-letter-header">{getFirstLetter(name)}</div>
            {/if}
            <Card selected={patientId === currentlySelectedPatient} name={name} patientId={patientId} dob={dob} on:click={(e) => currentlySelectedPatient = patientId}>
                Aliquam erat volutpat. Nunc eleifend leo vitae magna.
            </Card>
        {/each}

    </LeftPanel>
    <section class="content flex justify-center">
        <LargeRoundButton>Start Recording</LargeRoundButton>
    </section>
</body>

<style>
 .sticky-letter-header {
     position: sticky;
     top: -20px;
     z-index: 10;
     border-radius: 0 0 8px 8px;
     -webkit-backdrop-filter: blur(20px);
     background: rgba(250, 230, 255, .9);
     boder-radius: 3px;
     padding: 5px 10%;
     margin-bottom: 10px;
     width: 70%;
 }

 .content {
     transform: translate(0, -12px);
     width: 75vw;
     height: 100vh;
 }

 /* TODO use class */
 input[type="text"] {
     width: 90%;
 }
</style>
