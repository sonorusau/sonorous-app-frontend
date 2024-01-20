<script>
 import { createEventDispatcher } from 'svelte';
 import 'iconify-icon';
 export let disabled=true;

 const dispatch = createEventDispatcher();

 function handleClick(event) {
     if ( !disabled )
         dispatch('click', event);
 }
</script>

<div class="button--main cursor-pointer flex justify-center items-center no-select" class:disabled={disabled} on:click={handleClick}><slot></slot></div>

<style>
 .button--main {
     width: 25vw;
     height: 25vw;
     border-radius: 100%;
     color: #FFF;
     backdrop-filter: blur(10px);
     -webkit-backdrop-filter: blur(10px);
     background: rgba(30, 144, 255, .5);
     transition: background .2s ease-in, font-color .2s ease-in;
 }

 .disabled {
     background: rgba(110,100,120, 0.5);
     cursor: not-allowed !important;
 }

 .flex {
     display: flex
 }

 .justify-center {
     justify-content: center
 }

 .items-center {
     align-items: center
 }

 .cursor-pointer {
     cursor: pointer
 }

 @media (min-width: 640px) {
		 main {
			   max-width: none;
		 }
 }
</style>
