import { writable } from 'svelte/store';
import type IGlobalState from './lib/interface/IGlobalState';

const stages = {
    Home: 0,
    ConnectDevice: 2,
    PositionDevice: 2,
    NewPatientPage: 1,
    About: 1
} as const;

export const globalState = writable<IGlobalState>({
    currentPatient: null,
    deviceInfo: null,
    locationOfRecording: null,
    showToast: false,
    currentStage: 0
});
