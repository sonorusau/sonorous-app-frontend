<script lang="ts">
 export let icon: string | null = null;
 export let placeholder: string | null = null;
 import Icon from '@iconify/svelte';

 const iconifyIcon = document.querySelector('iconify-icon');

 $:  if (iconifyIcon && iconifyIcon.shadowRoot) {
     const existingStyle = iconifyIcon.shadowRoot.querySelector('style');
     if (existingStyle) {
         existingStyle.remove();
     }
 }
</script>

<div class="input-group input-group-icon">
    <input class="input--text" type="text" placeholder={placeholder} />
    {#if icon}
        <div class="input-icon">
            <Icon class="icon" icon={icon} style="width: 44%; height: 40%;" />
        </div>
    {/if}
</div>

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
 }

 input:focus {
     outline: 0;
     border-color: #bd8200;
 }

 .input-icon {
     display: flex;
     justify-content: center;
     align-items: center
 }

 input:focus + .input-icon {
     color: #f0a500;
 }

 input:focus + .input-icon:after {
     border-right-color: #f0a500;
 }

 .input-group {
     margin-bottom: 1em;
     zoom: 1;
 }

 .input-group:before,
 .input-group:after {
     content: "";
     display: table;
 }

 .input-group:after {
     clear: both;
 }

 .input-group-icon {
     position: relative;
 }

 .input-group-icon input {
     padding-left: 4.4em;
 }

 .input-group-icon .input-icon {
     position: absolute;
     top: 0; left: 0;
     width: 3.4em;
     height: 3.4em;
     line-height: 3.4em;
     text-align: center;
     pointer-events: none;
 }

 .input-group-icon .input-icon:after {
     position: absolute;
     top: 0.6em;
     bottom: 0.6em;
     left: 3.4em;
     display: block;
     border-right: 1px solid #e5e5e5;
     content: "";
     -webkit-transition: 0.35s ease-in-out;
     -moz-transition: 0.35s ease-in-out;
     -o-transition: 0.35s ease-in-out;
     transition: 0.35s ease-in-out;
     transition: all 0.35s ease-in-out;
 }
</style>
