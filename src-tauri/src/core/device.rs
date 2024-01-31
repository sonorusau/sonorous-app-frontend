use cpal::traits::{DeviceTrait, HostTrait};

pub fn get_device() {
    let host = cpal::default_host();
    let devices = host.devices();

    match devices {
        Ok(devices) => {
            for device in devices {
                match device.name() {
                    Ok(name) => println!("Device: {:?}", name),
                    Err(e) => println!("Error getting device name: {:?}", e),
                }
            }
        }
        Err(e) => println!("Error retrieving devices: {:?}", e),
    }
}
