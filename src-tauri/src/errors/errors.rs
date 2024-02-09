#[derive(Debug)]
pub enum Errors {
    FailedToWriteFileError,
    FailedToOpenFileError,
    InvalidDataError,
    OtherError,
}


impl Errors {
    pub fn as_str(&self) -> String {
        match self {
            Errors::FailedToWriteFileError => "Failed to write file".to_string(),
            Errors::FailedToOpenFileError => "Failed to open file".to_string(),
            Errors::InvalidDataError => "Invalid data".to_string(),
            Errors::OtherError => "Other error".to_string()
        }
    }
}
