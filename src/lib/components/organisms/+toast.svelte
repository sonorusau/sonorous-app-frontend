<script>
 import { push } from 'svelte-spa-router';
 import { onMount } from 'svelte';
 import { globalState } from '../../../stores';

 let patientInfo;
 $: patientInfo = $globalState.currentPatient;

 const capitalizeFirstLetter = (string) => {
     return string.charAt(0).toUpperCase() + string.slice(1);
 }

 const closeModal = () => {
     globalState.update(state => {
         state.showToast = false;
         return state;
     });
 }

</script>

<section class="toast flex flex-col items-center box-border">
    <div on:click = {() => closeModal()} class="position-absolute close-modal-button button">
        Close
    </div>
    <header class="self-start"><h2>{patientInfo.name}</h2></header>
    <p>{patientInfo.description}</p>
    <table>
        <thead>
            <tr>
                <th>Patient Info</th>
                <th></th>
            </tr>
        </thead>
        <tr>
            <td>Date of Birth</td>
            <td>{patientInfo.dob}</td>
        </tr>
        <tr>
            <td>Patient Gender</td>
            <td>{capitalizeFirstLetter( patientInfo.gender )}</td>
        </tr>
        <tr>
            <td>PatientId</td>
            <td>{patientInfo.patientId}</td>
        </tr>
        <tr>
            <td>Patient Blood Type</td>
            <td>{patientInfo.bloodType ?? "Unknown"}</td>
        </tr>
        <tr>
            <td>Conditions</td>
            <td>
                {capitalizeFirstLetter( patientInfo.conditions.join(", ") )}
            </td>
        </tr>
    </table>

    <header class="self-start"><h3>Recordings</h3></header>
</section>

<style>
 .toast {
     position: fixed;
     top: 50%;
     left: 50%;
     height: 80%;
     padding: 50px;
     width: 80%;
     transform: translate(-50%, -45%);
     border-radius: 12px;
     background: rgba(240, 240, 255, .5);
     -webkit-backdrop-filter: blur(10px);
     backdrop-filter: blur(10px);
     z-index: 1000;
 }

 table {
     font-size: .95rem;
     border-collapse: collapse;
     z-index: 2;
     border: .1px solid #CCC;
     overflow: hidden;
     box-shadow: 0 0 20px rgba(220,200,190,0.1);
 }

 th, td {
     padding: 15px;
     background-color: rgba(255,255,255,0.2);
     color: #000;
 }

 th {
     text-align: left;
 }

 td, tr, th {
     transition: background-color .3s ease-in-out;
 }

 thead th {
     background: var(--dark-mode-purple-2);
     color: #000
 }

 tbody tr:hover {
     background-color: rgba(190,200,255,0.5)
 }

 tbody td {
     position: relative;
 }

 tbody td:hover:before {
     content: "";
     position: absolute;
     left: 0; right: 0;
     top: -9999px;
     bottom: -9999px;
     background-color: rgba(180,200,255,0.2);
     z-index: -1
 }

 .close-modal-button {
     top: 10px;
     right: 10px;
 }
</style>
