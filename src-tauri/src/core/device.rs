use cpal::traits::{DeviceTrait, HostTrait};

pub fn get_device() {
    let host = cpal::default_host();
    // let device = host.default_input_device().expect("no output device available");
    
    let devices = host.devices();
    match devices {
        Ok(device) => {
            let a = device.map(|mut iter| iter.next().is_some())
            println!("Devices {:?}", "asdsa");
        },
        Err(_) => {
        
        }
    }
}
