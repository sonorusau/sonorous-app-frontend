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
     width: 20vw;
     height: 20vw;
     border-radius: 100%;
     color: #FFF;
     backdrop-filter: blur(20px);
     background: rgba(30, 144, 255, .5);
     transition: background .2s ease-in;
 }

 .disabled {
     background: rgba(210,210,180, 0.3);
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
