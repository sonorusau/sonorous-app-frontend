import { writable } from 'svelte/store';

export const globalState = writable({
    currentPatient: null
});
