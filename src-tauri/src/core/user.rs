use log::info;
use uuid::Uuid;
use crate::models::{ user_data::UserData, users::Users };
use std::{fs::{self, File, OpenOptions}, io::{Read, Write}};
use std::path::{PathBuf, Path};
use serde_json::from_str;
use crate::errors::errors::Errors;
use dirs_next::data_local_dir;

#[tauri::command]
pub fn my_custom_command() -> String {
    info!("Received from UI");
    "Response from Rust".into()
}

#[tauri::command(rename_all = "snake_case")]
pub fn save_user(user_data: Option<UserData>) -> Result<String, String> {
    let data_dir = data_local_dir().unwrap_or_else(|| PathBuf::from("."));
    let app_data_path = data_dir.join("Sonorus");
    let path = app_data_path.join("data.json");

    info!("Data directory {:?}", path);

    if !app_data_path.exists() {
        fs::create_dir_all(&app_data_path).map_err(|_| "Failed to create application data directory".to_string())?;
    }

    match OpenOptions::new().read(true).write(true).create(true).open(&path) {
        Ok(file) => file,

        Err(_) => return Err("Unable to open or create the data file".to_string()),
    };

    match user_data {
        Some(mut new_data) => {
            info!("Received data for user: {:?}", new_data.name);
            let mut file_content = String::new();
            let mut users = match File::open(&path) {
                Ok(mut file) => {
                    file.read_to_string(&mut file_content).unwrap_or_else(|_| 0); // Read existing data
                    serde_json::from_str::<Users>(&file_content).unwrap_or_else(|_| Users { users: vec![] }) // Deserialize or initialize
                },
                Err(_) => Users { users: vec![] },
            };
            new_data.patientId = Some(Uuid::new_v4());
            users.users.push(new_data);
            let serialized = serde_json::to_string(&users).unwrap_or_else(|_| "Failed to serialize data".to_string());
            info!("Writing to file {:?}", path);
            let mut file = match OpenOptions::new().write(true).truncate(true).open(&path) {
                Ok(file) => file,
                Err(_) => {
                    info!("Failed to open file");
                    return Err(path.to_str().unwrap_or("Failed to open file").to_string());
                },
            };
            if let Err(_) = file.write_all(serialized.as_bytes()) {
                info!("Failed to write to file");
                return Err(Errors::FailedToWriteFileError.as_str());
            }
            info!("Data appended successfully");
            Ok("Data appended successfully".into())
        },
        None => Err(Errors::InvalidDataError.as_str())
    }
}

#[tauri::command]
pub fn get_users(callSource: Option<String>) -> Result<Vec<UserData>, String> { // Adjust the return type if needed
    let data_dir = data_local_dir().unwrap_or_else(|| PathBuf::from("."));
    let path = data_dir.join("Sonorus").join("data.json");
    info!("Data directory {:?}", path);

    let mut file = match File::open(&path) {
        Ok(file) => file,
        Err(_) => {
            info!("Failed to open file");
            return Err("Failed to open file".into());
        },
    };
    callSource.map(|source| info!("Received call from {}", source));
    let mut file_content = String::new();
    if file.read_to_string(&mut file_content).is_err() {
        info!("Failed to read file content");
        return Err("Failed to read file content".into());
    };
    info!("Read file content");
    let users: Users = match from_str(&file_content) {
        Ok(data) => data,
        Err(_) => {
            info!("Failed to deserialize file content");
            return Err("Failed to deserialize file content".into());
        },
    };
    Ok(users.users)
}
