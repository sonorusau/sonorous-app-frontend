interface IPatientInfo {
     "patientId": string
     "name": string
     "dob": string
     "description": string
     "conditions": string[],
     "gender": "Male" | "Female"
 }

export default IPatientInfo;
