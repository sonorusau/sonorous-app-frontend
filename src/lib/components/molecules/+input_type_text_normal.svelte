<script lang="ts">
 export let placeholder: string | null = null;
 export let disabled: boolean = false;
 import { createEventDispatcher } from 'svelte';

 const dispatch = createEventDispatcher();
 let target: HTMLInputElement | null = null;
 let value = '';

 function updateValue() {
     dispatch('input', value);
 }
</script>

<input
    on:input={updateValue}
    bind:value={value}
    class="input--text"
    type="text"
    placeholder={placeholder}
    disabled={disabled} />

<style>
 input {
     width: 100%;
     padding: 1em;
     line-height: 1.4;
     background-color: #f9f9f9;
     border: 1px solid #e5e5e5;
     border-radius: 3px;
     -webkit-transition: 0.35s ease-in-out;
     -moz-transition: 0.35s ease-in-out;
     -o-transition: 0.35s ease-in-out;
     transition: 0.35s ease-in-out;
     transition: all 0.35s ease-in-out;
     margin-right: 4px;
 }

 input:focus {
     outline: 0;
     border-color: #bd8200;
 }
</style>
