// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod core;
mod models;
use tauri::{Runtime, Window, Manager};
use log::info;
use crate::core::{ device, user };

fn main() {
    env_logger::init();
    info!("Starting application");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![user::my_custom_command, user::save_user, user::get_users])
        // .invoke_handler(tauri::generate_handler![user::save_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}
