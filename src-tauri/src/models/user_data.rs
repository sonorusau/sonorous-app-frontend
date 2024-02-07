use serde::{Deserialize, Serialize};
use uuid::Uuid;
use serde::ser::Serializer;
use serde::de::{self, Deserializer};

pub mod uuid_format {
    use log::info;
    use super::*;
    pub fn serialize<S>(uuid: &Option<Uuid>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match uuid {
            Some(uuid) => {
                let s = uuid.to_string();
                serializer.serialize_str(&s)
            },
            _ => serializer.serialize_none(),
        }
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Option<Uuid>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s: Option<String> = Option::deserialize(deserializer)?;
        match s {
            Some(str) if !str.is_empty() => {
                match Uuid::parse_str(&str) {
                    Ok(uuid) => {
                        info!("Original uuid string {}", str);
                        Ok(Some(uuid))
                    },
                    Err(_) => Ok(None),
                }
            },
            _ => Ok(None),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct UserData {
    #[serde(with = "uuid_format", default)]
    pub patientId: Option<Uuid>,
    pub name: String,
    pub dob: String,
    pub description: Option<String>,
    pub conditions: Option<Vec<String>>,
    pub gender: String,
    pub age: Option<u32>,
}
