<script lang="ts">
 import Router, {push} from 'svelte-spa-router';
 import Home from './routes/+Home.svelte';
 import Background from './lib/components/templates/+background.svelte';
 import ConnectDevice from './routes/+connect_device.svelte';
 import Toast from "./lib/components/organisms/+toast.svelte";
 import PositionDevice from './routes/+position_device.svelte';
 import NewRecording from './routes/+new_recording.svelte';
 import NewPatientPage from './routes/+new_patient_form.svelte';
 import ChooseRecordingPosition from "./routes/+choose_recording_position.svelte";
 import About from './routes/+About.svelte';
 import 'iconify-icon';
 import { globalState } from './stores';

 let navbarRef: HTMLElement;

 $: currentPatient = $globalState.currentPatient;
 $: currentStage = $globalState.currentStage;
 $: deviceInfo = $globalState.deviceInfo;
 $: showToast = $globalState.showToast;
 
 $: {
     const { currentStage } = $globalState;
     if (navbarRef) {
         if (currentStage >= 1) {
             navbarRef.classList.add('extend');
         } else {
             navbarRef.classList.remove('extend');
         }
     }
 }

 const routes = {
     '/': Home,
     '/choose_recording_position': ChooseRecordingPosition,
     '/connect_device': ConnectDevice,
     '/position_device': PositionDevice,
     '/choose_recording_position': ChooseRecordingPosition,
     '/new_recording': NewRecording,
     '/new_patient': NewPatientPage,
     '/about': About
 };

 const cancel = () => {
     push("/");
     globalState.update(state => {
         state.currentStage = 0;
         return state;
     });
     globalState.update(state => {
         state.showToast = false;
         return state;
     });
 }

 const showPatientInfoModal = () => {
     if ($globalState.currentPatient !== null) {
         globalState.update(state => {
             state.showToast = true;
             return state;
         });
     }
 }
</script>

<body>
    {#if showToast }
        <Toast />
    {/if}
    <Background />
    <main>
        <nav class="navbar extend flex flex-row items-center space-around" bind:this={navbarRef}>
            {#if currentStage >= 1}
                <div 
                    role="button"
                    class="button position-absolute left-10 first-child-is-icon"
                    on:click={() => cancel()}
                    on:keydown={(e) => (e.key === 'Enter' || e.key === 'Space') && cancel()}
                    tabindex="0"
                    >
                    <iconify-icon icon="mdi:cancel" />
                    Cancel
                </div>
            {/if}
            <div on:click = {() => showPatientInfoModal()} class="flex flex-row items-center cursor-pointer first-child-is-icon">
                {#if currentPatient !== null}
                    <iconify-icon icon="fluent:patient-20-filled"/><p>{currentPatient?.name}</p>
                {:else}
                    <iconify-icon icon="mingcute:warning-line"/> <p>Please Select a Patient to Start Recording</p>
                {/if}
            </div>
            <div class="flex flex-row items-center cursor-pointer first-child-is-icon">
                {#if deviceInfo !== null}
                    <iconify-icon icon="fluent:device-eq-16-filled"/> <span>Connected: {deviceInfo}</span>
                {:else}
                    <iconify-icon icon="mingcute:warning-line"/> <p>No Device Connected</p>
                {/if}
            </div>
        </nav>
        <Router {routes} />
</body>


<style>
 .navbar {
     z-index: 10;
     padding-top: 15px;
     position: fixed;
     min-height: 70px;
     top: 0;
     right: 0;
     background: rgba(240, 240, 240, .3);
     -webkit-backdrop-filter: blur(20px);
     transition: width .1s ease-in-out;
     width: calc(100vw - min(var(--panel-width), var(--panel-max-width)));
 }

 .navbar.extend {
     width: 100%;
 }

</style>
