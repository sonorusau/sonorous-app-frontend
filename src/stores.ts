import { writable } from 'svelte/store';
import type IGlobalState from './lib/interface/IGlobalState';

export const globalState = writable<IGlobalState>({
    currentPatient: null,
    deviceInfo: null,
    currentStage: 0
});
