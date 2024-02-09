import type IPatientInfo from "./IPatientInfo";

interface IGlobalState {
    locationOfRecording: "AORTIC" | "TRICUSPID" | "PULMONIC" | "MITRAL" | null,
    currentPatient: IPatientInfo | null,
    deviceInfo: string | null,
    showToast: boolean,
    currentStage: number
}

export default IGlobalState;
