use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct UserData {
    pub name: String,
    pub dob: String,
    pub description: Option<String>,
    pub conditions: Option<Vec<String>>,
    pub gender: String,
    pub age: u32,
}
