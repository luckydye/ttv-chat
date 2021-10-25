#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::command;
use tauri::Manager;

use tokio::sync::mpsc;

use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::message::ServerMessage;
use twitch_irc::TwitchIRCClient;
use twitch_irc::{ClientConfig, SecureTCPTransport};

static mut db: ChatState = ChatState {
  connected_channels: vec![],
  chat_client: None,
};

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct ChatTransport {
  message: String,
  prefix: String,
}

struct ChatState {
  connected_channels: Vec<String>,
  chat_client: Option<TwitchIRCClient<SecureTCPTransport, StaticLoginCredentials>>,
}

impl ChatState {
  pub fn set_client(
    &mut self,
    client: TwitchIRCClient<SecureTCPTransport, StaticLoginCredentials>,
  ) {
    self.chat_client = Some(client);
  }

  pub fn join_room(mut self, channel_name: String) {
    if self.chat_client.is_some() {
      self.connected_channels.push(channel_name.to_owned());

      let x = self.chat_client.as_ref().unwrap();
      x.join(channel_name.to_owned());
    }
  }

  pub fn leave_room(&mut self, channel_name: String) {
    if self.chat_client.is_some() {
      let x = self.chat_client.as_ref().unwrap();
      x.part(channel_name.to_owned());

      let index = self
        .connected_channels
        .iter()
        .position(|n| *n == channel_name)
        .unwrap();
      self.connected_channels.remove(index);
    }
  }

  pub async fn handle_chat_messages(
    &self,
    app_handle: tauri::AppHandle,
    mut incoming_messages: mpsc::UnboundedReceiver<ServerMessage>,
  ) {
    // first thing you should do: start consuming incoming messages,
    // otherwise they will back up.
    let join_handle = tokio::spawn(async move {
      while let Some(message) = incoming_messages.recv().await {
        // println!("Received message: {:?}", message);
        let irc_message = message.source();
        let msg = serde_json::to_string(&irc_message.params).unwrap();
        let prefix = irc_message.prefix.as_ref().unwrap();
        let transportMessage = ChatTransport {
          message: msg,
          prefix: format!("{:?}", prefix),
        };
        app_handle
          .emit_all("chat.message", transportMessage)
          .unwrap();
      }
    });

    // keep the tokio executor alive.
    // If you return instead of waiting the background task will exit.
    join_handle.await.unwrap();
  }

  pub async fn test(&self) {
    println!("Testing")
  }
}

#[command]
fn connect_to_chat(
  app_handle: tauri::AppHandle,
  state: tauri::State<'_, ChatState>,
  username: String,
  token: String,
) {
  let creds = StaticLoginCredentials::new(username, Some(token));
  let config = ClientConfig::new_simple(creds);

  let (incoming_messages, client) =
    TwitchIRCClient::<SecureTCPTransport, StaticLoginCredentials>::new(config);

  state.set_client(client);

  state.handle_chat_messages(app_handle, incoming_messages);
}

#[command]
fn chat_join_room(
  state: tauri::State<'_, ChatState>,
  channel: String,
) {
  state.join_room(channel);
}

#[tokio::main]
pub async fn main() {
  let default_state = ChatState {
    connected_channels: vec![],
    chat_client: None,
  };

  tauri::Builder::default()
    .manage(default_state)
    .invoke_handler(tauri::generate_handler![connect_to_chat])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
