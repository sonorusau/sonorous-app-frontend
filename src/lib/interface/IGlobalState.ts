import type IPatientInfo from "./IPatientInfo";

interface IGlobalState {
    currentPatient: IPatientInfo | null,
    deviceInfo: string | null,
    currentStage: number
}

export default IGlobalState;
