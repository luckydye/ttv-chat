#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use webbrowser;

use tauri::command;
use tauri::Manager;

use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::message::Badge;
use twitch_irc::message::ServerMessage;
use twitch_irc::message::Emote;
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
  id: String,
  message: String,
  sender: String,
  sender_id: String,
  channel: String,
  is_action: bool,
  badges: Vec<Badge>,
  badge_info: Vec<Badge>,
  bits: u64,
  name_color: Vec<u8>,
  emotes: Vec<Emote>,
  server_timestamp: String,
}

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct ChatClearMessage {
  id: String,
  message: String,
  sender: String,
  channel: String,
  is_action: bool,
  server_timestamp: String,
}

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct ChatUser {
  channel: String,
  username: String,
  badges: Vec<Badge>,
  badge_info: Vec<Badge>,
  name_color: Vec<u8>,
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

  pub async fn send(&mut self, channel_name: String, message: String) {
    if self.chat_client.is_some() {
      println!("sending {}: {}", channel_name, message);
      match &self.chat_client {
        Some(client) => {
          client.privmsg(channel_name, message).await.unwrap();
        }
        None => {}
      }
    }
  }

  pub fn join_room(&mut self, channel_name: String) {
    if self.chat_client.is_some() {
      // only join if not already joined to that room
      if !self.connected_channels.contains(&channel_name) {
        self.connected_channels.push(channel_name.to_owned());

        let client = self.chat_client.as_ref().unwrap();
        client.join(channel_name.to_owned());
      }
    }
  }

  pub fn leave_room(&mut self, channel_name: String) {
    if self.chat_client.is_some() {
      let client = self.chat_client.as_ref().unwrap();
      client.part(channel_name.to_owned());

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
          let transport = ChatTransport {
            id: msg.message_id.to_owned(),
            message: msg.message_text.to_owned(),
            sender: msg.sender.name.to_owned(),
            sender_id: msg.sender.id.to_owned(),
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
            emotes: msg.emotes,
            server_timestamp: msg.server_timestamp.to_rfc2822(),
          };
          app_handle.emit_all("chat.message", transport).unwrap();
        }
        ServerMessage::UserState(msg) => {
          let transport = ChatUser {
            channel: msg.channel_login.to_owned(),
            username: msg.user_name.to_owned(),
            badges: msg.badges,
            badge_info: msg.badge_info,
            name_color: match msg.name_color {
              Some(nc) => {
                vec![nc.r, nc.g, nc.b]
              }
              None => vec![240u8, 240u8, 240u8],
            },
          };
          app_handle.emit_all("chat.user", transport).unwrap();
        }
        ServerMessage::Whisper(msg) => {
          println!("(whisper) {}: {}", msg.sender.name, msg.message_text);
        }
        ServerMessage::GlobalUserState(msg) => {
          println!("(user) {}", msg.user_id);
        }
        ServerMessage::RoomState(msg) => {
          app_handle.emit_all("chat.state", msg).unwrap();
        }
        ServerMessage::ClearMsg(msg) => {
          // message deletes
          let transport = ChatClearMessage {
            id: msg.message_id.to_owned(),
            message: msg.message_text.to_owned(),
            sender: msg.sender_login.to_owned(),
            channel: msg.channel_login.to_owned(),
            is_action: false,
            server_timestamp: msg.server_timestamp.to_rfc2822(),
          };
          app_handle.emit_all("chat.delete.message", transport).unwrap();
        }
        ServerMessage::ClearChat(msg) => {
          // message deletes
          app_handle.emit_all("chat.clear", msg).unwrap();
        }
        ServerMessage::UserNotice(msg) => {
          // sub messages and stuff
          let transport = ChatTransport {
            id: msg.message_id.to_owned(),
            message: msg.system_message.to_owned(),
            sender: msg.sender.name.to_owned(),
            sender_id: msg.sender.id.to_owned(),
            channel: msg.channel_login.to_owned(),
            is_action: false,
            badges: msg.badges,
            badge_info: msg.badge_info,
            bits: 0,
            name_color: vec![240u8, 240u8, 240u8],
            emotes: msg.emotes,
            server_timestamp: msg.server_timestamp.to_rfc2822(),
          };
          app_handle.emit_all("chat.info", transport).unwrap();
        }
        ServerMessage::Notice(msg) => {
          app_handle.emit_all("chat.notice", msg).unwrap();
        }
        msg => {
          println!("{:?}", msg);
        }
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

#[command]
async fn chat_send_message(channel: String, message: String) {
  unsafe {
    app_chat_state.send(channel, message).await;
  }
}

#[command]
fn open_link(url: String) {
  if webbrowser::open(&url).is_ok() {
    println!("opened link");
  }
}

// #[tokio::main]
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      connect_to_chat,
      chat_join_room,
      chat_leave_room,
      chat_send_message,
      open_link
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
