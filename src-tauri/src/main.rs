#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::command;
use tauri::Manager;

use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::message::IRCPrefix;
use twitch_irc::message::AsRawIRC;
use twitch_irc::TwitchIRCClient;
use twitch_irc::{ClientConfig, SecureTCPTransport};

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct ChatTransport {
  message: String,
  // prefix: String,
}

#[command]
async fn connect_to_chat(
  app_handle: tauri::AppHandle,
  channel: String,
  username: String,
  token: String,
) {
  let creds = StaticLoginCredentials::new(username, Some(token));
  let config = ClientConfig::new_simple(creds);

  let (mut incoming_messages, client) =
    TwitchIRCClient::<SecureTCPTransport, StaticLoginCredentials>::new(config);

  // first thing you should do: start consuming incoming messages,
  // otherwise they will back up.
  let join_handle = tokio::spawn(async move {
    while let Some(message) = incoming_messages.recv().await {
      // println!("Received message: {:?}", message);

      let irc_message = message.source();
      let msg = serde_json::to_string(&irc_message.params).unwrap();

      let prefix = &irc_message.prefix;

      let transportMessage = ChatTransport {
        message: msg,
        // prefix: prefix.user,
      };

      app_handle
        .emit_all("chat.message", transportMessage)
        .unwrap();
    }
  });

  client.join(channel.to_owned());

  // keep the tokio executor alive.
  // If you return instead of waiting the background task will exit.
  join_handle.await.unwrap();
}

#[tokio::main]
pub async fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![connect_to_chat])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
