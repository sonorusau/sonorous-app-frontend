<script lang="ts">
 import { createEventDispatcher } from 'svelte';
 import 'iconify-icon';
 export let name;
 export let gender;
 export let patientId;
 export let dob;
 export let selected=false;

 const dispatch = createEventDispatcher();

 function handleClick(event) {
     dispatch('click', event);
 }
</script>

<div class="card cursor-pointer no-select position-relative" class:selected={selected} on:click={handleClick}>
    <span class="card__name">{ name }</span>
    <div class="card__text">DOB: { dob ?? "" }</div>
    <div class="card__text">patientId: { patientId ?? "" }</div>
    <p class="card__description"><slot></slot></p>
    {#if selected}
        <div class="card__selected-indicator"><iconify-icon icon="subway:tick" /></div>
    {/if}
</div>

<style>
 .card {
     padding: 10px;
     border: .2px solid #CCC;
     box-shadow: .5px .5px 1px rgba(139, 101, 77, 0.2),
     .5px .5px 1px rgba(139, 101, 77, 0.2);
     text-align: left;
     background: #FEFEFE;
     border-radius: 5px;
     margin-bottom: 10px;
     width: 300px;
     max-width: 80%;
     min-height: 100px
 }

 .selected {
     background: #99EE99 !important;
 }

 .card__selected-indicator {
     position: absolute;
     top: 10px; right: 10px;
     color: #339900;
 } 

 .card__text {
     font-color: #555;
     font-size: .8em;
 }

 .card__description {
     font-color: #888;
     font-size: .7em;
 }

 .card__name {
     font-size: 1.5em;
 }
</style>
