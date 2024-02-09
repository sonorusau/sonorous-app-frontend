
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use cocoa::appkit::{NSWindow, NSWindowStyleMask};
use tauri::{Runtime, Window, Manager};

mod core;
use crate::core::device;

// pub trait WindowExt {
//     #[cfg(target_os = "macos")]
//     fn set_transparent_titlebar(&self, transparent: bool);
// }

// impl<R: Runtime> WindowExt for Window<R> {
//     #[cfg(target_os = "macos")]
//     fn set_transparent_titlebar(&self, transparent: bool) {
//         use cocoa::appkit::NSWindowTitleVisibility;

//         unsafe {
//             let id = self.ns_window().unwrap() as cocoa::base::id;

//             let mut style_mask = id.styleMask();
//             style_mask.set(
//                 NSWindowStyleMask::NSFullSizeContentViewWindowMask,
//                 transparent,
//             );
//             id.setStyleMask_(style_mask);

//             id.setTitleVisibility_(if transparent {
//                 NSWindowTitleVisibility::NSWindowTitleHidden
//             } else {
//                 NSWindowTitleVisibility::NSWindowTitleVisible
//             });
//             id.setTitlebarAppearsTransparent_(if transparent {
//                 cocoa::base::YES
//             } else {
//                 cocoa::base::NO
//             });
//         }
//     }
// }

fn main() {
    println!("HERE");
    device::get_device();
    // device::search_devices();
    // request::request();
    tauri::Builder::default()
        // .setup(|app| {
        //     let win = app.get_window("main").unwrap();
        //     win.set_transparent_titlebar(true);

        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
