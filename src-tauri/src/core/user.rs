use log::info;
use crate::models::{ user_data::UserData, users::Users };
use std::{fs::{self, File, OpenOptions}, io::{Read, Write}};
use serde_json::from_str;


#[tauri::command]
pub fn my_custom_command() -> String {
    info!("Received from UI");
    "Response from Rust".into()
}

#[tauri::command(rename_all = "snake_case")]
pub fn save_user(user_data: Option<UserData>) -> String {
    let path = "/Users/blackfish/sonorous-app-frontend/src-tauri/data.json";
    match user_data {
        Some(new_data) => {
            info!("Received data for user: {:?}", new_data.name);
            let mut file_content = String::new();
            let mut users = match File::open(&path) {
                Ok(mut file) => {
                    file.read_to_string(&mut file_content).unwrap_or_else(|_| 0); // Read existing data
                    serde_json::from_str::<Users>(&file_content).unwrap_or_else(|_| Users { users: vec![] }) // Deserialize or initialize
                },
                Err(_) => Users { users: vec![] },
            };
            users.users.push(new_data);
            let serialized = serde_json::to_string(&users).unwrap_or_else(|_| "Failed to serialize data".to_string());
            info!("Writing to file {}", path);
            let mut file = match OpenOptions::new().write(true).truncate(true).open(&path) {
                Ok(file) => file,
                Err(_) => {
                    info!("Failed to open file");
                    return "Failed to open file".into()
                },
            };
            if let Err(_) = file.write_all(serialized.as_bytes()) {
                info!("Failed to write to file");
                return "Failed to write to file".into();
            }
            info!("Data appended successfully");
            "Data appended successfully".into()
        },
        None => "No data to save".into(),
    }
}


#[tauri::command]
pub fn get_users() -> Result<Vec<UserData>, String> { // Adjust the return type if needed
    let path = "/Users/blackfish/sonorous-app-frontend/src-tauri/data.json";
    let mut file = match File::open(&path) {
        Ok(file) => file,
        Err(_) => {
            info!("Failed to open file");
            return Err("Failed to open file".into());
        },
    };

    let mut file_content = String::new();
    if file.read_to_string(&mut file_content).is_err() {
        info!("Failed to read file content");
        return Err("Failed to read file content".into());
    }

    info!("Read file content: {}", file_content);
    let users: Users = match from_str(&file_content) { // Adjust according to your JSON structure
        Ok(data) => data,
        Err(_) => {
            info!("Failed to deserialize file content");
            return Err("Failed to deserialize file content".into());
        },
    };

    Ok(users.users) // Return the deserialized users
}
