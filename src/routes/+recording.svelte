<script lang="ts">
 import { push } from 'svelte-spa-router';
 import { onMount } from 'svelte';
 import { globalState } from '../stores';

 onMount(() => {
 });
</script>

<section class="record-section flex flex-col justify-center items-center">
    <header><h3>Recording Please Hold Device</h3></header>
</section>

<style>
 @keyframes swingAnimation {
     0%, 100% {
         transform: rotate(-10deg);
     }
     50% {
         transform: rotate(10deg);
     }
 }

 .record-section{
     padding: 10px;
     box-sizing: border-box;
     position: absolute;
     animation: fade-in .2s ease-in-out;
     top: 50%;
     left: 50%;
     transform: translateX(-50%) translateY(-50%);
     background: rgba(240, 240, 240, .3);
     border-radius: 12px;
     -webkit-backdrop-filter: blur(5px);
     backdrop-filter: blur(5px);
 }

 .position-device-section header {
     position: absolute;
     bottom: 8%; right: 6%;
     color: #555;
     width: 45%;
 }
</style>
