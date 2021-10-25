#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::command;
use tauri::Manager;

use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::message::Badge;
use twitch_irc::message::ServerMessage;
use twitch_irc::TwitchIRCClient;
use twitch_irc::{ClientConfig, SecureTCPTransport};

static mut app_chat_state: ChatState = ChatState {
  connected_channels: vec![],
  chat_client: None,
};

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct ChatTransport {
  message: String,
  sender: String,
  channel: String,
  is_action: bool,
  badges: Vec<Badge>,
  badge_info: Vec<Badge>,
  bits: u64,
  name_color: Vec<u8>,
  // emotes: vec![],
  server_timestamp: String,
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

  pub fn join_room(&mut self, channel_name: String) {
    if self.chat_client.is_some() {
      // only join if not already joined to that room
      if !self.connected_channels.contains(&channel_name) {
        self.connected_channels.push(channel_name.to_owned());

        let x = self.chat_client.as_ref().unwrap();
        x.join(channel_name.to_owned());
      }
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
}

#[command]
async fn connect_to_chat(app_handle: tauri::AppHandle, username: String, token: String) {
  println!("Connecting to chat");

  let creds = StaticLoginCredentials::new(username, Some(token));
  let config = ClientConfig::new_simple(creds);
  let (mut incoming_messages, client) =
    TwitchIRCClient::<SecureTCPTransport, StaticLoginCredentials>::new(config);
  // first thing you should do: start consuming incoming messages,
  // otherwise they will back up.
  let join_handle = tokio::spawn(async move {
    while let Some(message) = incoming_messages.recv().await {
      // println!("Received message: {:?}", message);
      match message {
        ServerMessage::Privmsg(msg) => {
          app_handle
            .emit_all(
              "chat.message",
              ChatTransport {
                message: msg.message_text.to_owned(),
                sender: msg.sender.name.to_owned(),
                channel: msg.channel_login.to_owned(),
                is_action: msg.is_action,
                badges: msg.badges,
                badge_info: msg.badge_info,
                bits: match msg.bits {
                  Some(nc) => nc,
                  None => 0,
                },
                name_color: match msg.name_color {
                  Some(nc) => {
                    vec![nc.r, nc.g, nc.b]
                  }
                  None => vec![240u8, 240u8, 240u8],
                },
                // emotes: vec![],
                server_timestamp: msg.server_timestamp.to_rfc2822(),
              },
            )
            .unwrap()
        }
        ServerMessage::Whisper(msg) => {
          println!("(w) {}: {}", msg.sender.name, msg.message_text);
        }
        _ => {}
      }
    }
  });

  unsafe {
    for chan in &app_chat_state.connected_channels {
      client.join(chan.to_owned());
    }

    app_chat_state.set_client(client);
  }
  // keep the tokio executor alive.
  // If you return instead of waiting the background task will exit.
  join_handle.await.unwrap();
}

#[command]
async fn chat_join_room(channel: String) {
  unsafe {
    app_chat_state.join_room(channel);
  }
}

#[command]
async fn chat_leave_room(channel: String) {
  unsafe {
    app_chat_state.leave_room(channel);
  }
}

#[tokio::main]
pub async fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      connect_to_chat,
      chat_join_room,
      chat_leave_room,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
