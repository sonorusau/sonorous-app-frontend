<script lang="ts">
    import { push } from 'svelte-spa-router';
    import { onMount } from 'svelte';
    import { globalState } from '../stores';
    import AudioVisualiser from '../components/AudioVisualiser.svelte';
</script>

<section class="new-recording-section flex flex-col justify-center items-center">
    <AudioVisualiser />
</section>

<style>
 .new-recording-section{
     width: 80%;
     height: 50%;
     padding: 100px;
     box-sizing: border-box;
     position: absolute;
     display: flex;
     justify-content: center;
     align-items: center;
     animation: fade-in .2s ease-in-out;
     top: 50%;
     left: 50%;
     transform: translateX(-50%) translateY(-50%);
     background: rgba(240, 240, 240, .3);
     border-radius: 12px;
     -webkit-backdrop-filter: blur(20px);
     backdrop-filter: blur(20px);
 }
</style>