use serde::{Deserialize, Serialize};
use crate::models::user_data::UserData;

#[derive(Serialize, Deserialize)]
pub struct Users {
    pub users: Vec<UserData>,
}
