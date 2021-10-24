#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::command;
use tauri::Manager;

use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::message::ServerMessage;
use twitch_irc::TwitchIRCClient;
use twitch_irc::{ClientConfig, SecureTCPTransport};

type Callback = fn(message: ServerMessage);

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

async fn connect_to_chat(callback: Callback, username: String, token: String) {
  let config = ClientConfig::default();
  let (mut incoming_messages, client) =
    TwitchIRCClient::<SecureTCPTransport, StaticLoginCredentials>::new(config);

  // first thing you should do: start consuming incoming messages,
  // otherwise they will back up.
  let join_handle = tokio::spawn(async move {
    while let Some(message) = incoming_messages.recv().await {
      println!("Incoming mesg");
      callback(message);
    }
  });

  client.join("richwcampbell".to_owned());

  // keep the tokio executor alive.
  // If you return instead of waiting the background task will exit.
  join_handle.await.unwrap();
}

// #[command]
// async fn joinChannel(channel: String) {
//   // join a channel
//   client.join(channel.to_owned());
// }

#[command]
async fn test(channel: String) {
  // leave a channel
  // client.part(channel);
}

#[tokio::main]
pub async fn main() {
  tauri::Builder::default()
    .setup(|app| {
      tokio::spawn(async move {
        connect_to_chat(
          |message| {
            // println!("Received message: {:?}", message);
            app.emit_all("chat.message", Payload { message: "message".to_string() }).unwrap();
          },
          "luckydye".to_string(),
          "_".to_string(),
        ).await;
      });
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![test])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
