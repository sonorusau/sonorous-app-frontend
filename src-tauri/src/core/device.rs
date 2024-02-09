use std::sync::Arc;

use rusb::{Device, UsbContext};
use cpal::traits::{DeviceTrait, HostTrait};

pub fn search_devices() -> Result<(), rusb::Error> {
    for device in rusb::devices()?.iter() {
        let device_desc = device.device_descriptor()?;
        println!("Bus {} Device {} ID {}:{}",
                 device.bus_number(),
                 device.address(),
                 device_desc.vendor_id(),
                 device_desc.product_id());
    }
    Ok(())
}

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
