<!-- App.svelte -->
<script>
 import Router from 'svelte-spa-router';
 import Home from './routes/+Home.svelte';
 import About from './routes/+About.svelte';
 import 'iconify-icon';

 import { globalState } from './stores';
 $: currentPatient = $globalState.currentPatient;

 const routes = {
     '/': Home,
     '/about': About
 };
</script>

<main>
    <nav class="navbar flex flex-row items-center space-around">
        {#if currentPatient !== null}
            <div class="button position-absolute left-10"><iconify-icon icon="mdi:cancel" />Cancel</div>
        {/if}
        <div>{currentPatient?.name ?? "Please Select a Patient to Start Recording"}</div>
    </nav>
    <Router {routes} />
</main>


<style>
 .navbar {
     z-index: 10;
     position: fixed;
     min-height: 70px;
     top: 0;
     right: 0;
     background: rgba(240, 240, 240, .3);
     -webkit-backdrop-filter: blur(20px);
     width: 75vw;
 }

</style>
