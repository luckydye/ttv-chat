#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use webbrowser;

use tauri::command;
use tauri::Manager;

use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::message::Badge;
use twitch_irc::message::Emote;
use twitch_irc::message::IRCTags;
use twitch_irc::message::ServerMessage;
use twitch_irc::message::UserNoticeEvent;
use twitch_irc::TwitchIRCClient;
use twitch_irc::{ClientConfig, SecureTCPTransport};

struct ChatState {
  connected_channels: Vec<String>,
  chat_client: Option<TwitchIRCClient<SecureTCPTransport, StaticLoginCredentials>>,
}

static mut APP_CHAT_STATE: ChatState = ChatState {
  connected_channels: vec![],
  chat_client: None,
};

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct FullBadge {
  name: String,
  version: String,
  description: String,
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

///////////////////
/// new interfaces

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct UserMessage {
  message_type: String,
  channel: String,
  id: String,             // message id
  text: String,           // user message
  user_name: String,      // username
  user_id: String,        // user id
  color: Vec<u8>,         // username color
  emotes: Vec<Emote>,     // emotes
  badges: Vec<FullBadge>, // badges + badge_info
  timestamp: String,      // tmi server timestamp
  is_action: bool,        // is /me message
  bits: u64,              // amounts of bits attached to this message
  tags: IRCTags,          // hgihlighted messages etc.
}

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
struct EventMessage {
  message_type: String,
  channel: String,
  id: String,                   // message id
  text: String,                 // system text
  message: Option<UserMessage>, // attatched user message
  timestamp: String,            // tmi server timestamp
  event: UserNoticeEvent,       // event causing this message
}

// end new
//////////////

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
          let mut badge_info_it = msg.badge_info.iter();
          let transport = UserMessage {
            message_type: "user".to_owned(),
            id: msg.message_id.to_owned(),
            text: msg.message_text.to_owned(),
            user_name: msg.sender.name.to_owned(),
            user_id: msg.sender.id.to_owned(),
            color: match msg.name_color {
              Some(nc) => vec![nc.r, nc.g, nc.b],
              None => vec![240u8, 240u8, 240u8],
            },
            emotes: msg.emotes,
            timestamp: msg.server_timestamp.to_rfc2822(),
            is_action: msg.is_action,
            bits: match msg.bits {
              Some(nc) => nc,
              None => 0,
            },
            tags: msg.source.tags,
            channel: msg.channel_login.to_owned(),
            badges: msg
              .badges
              .iter()
              .map(|badge| {
                let info = badge_info_it.next();
                FullBadge {
                  name: badge.name.to_owned(),
                  version: badge.version.to_owned(),
                  description: match info {
                    Some(info) => info.version.to_owned(),
                    None => "".to_owned(),
                  },
                }
              })
              .collect(),
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
          app_handle
            .emit_all("chat.delete.message", transport)
            .unwrap();
        }
        ServerMessage::ClearChat(msg) => {
          // message deletes
          app_handle.emit_all("chat.clear", msg).unwrap();
        }
        ServerMessage::UserNotice(msg) => {
          // sub messages and stuff

          let optional_message: Option<UserMessage> = match msg.message_text {
            Some(str) => {
              let mut badge_info_it = msg.badge_info.iter();
              Some(UserMessage {
                message_type: "user".to_owned(),
                id: msg.message_id.to_owned(),
                text: str.to_owned(),
                user_name: msg.sender.name.to_owned(),
                user_id: msg.sender.id.to_owned(),
                color: match msg.name_color {
                  Some(nc) => vec![nc.r, nc.g, nc.b],
                  None => vec![240u8, 240u8, 240u8],
                },
                emotes: msg.emotes,
                timestamp: msg.server_timestamp.to_rfc2822(),
                is_action: false,
                bits: 0,
                tags: msg.source.tags,
                channel: msg.channel_login.to_owned(),
                badges: msg.badges.iter().map(|badge| {
                  let info = badge_info_it.next();
                  FullBadge {
                    name: badge.name.to_owned(),
                    version: badge.version.to_owned(),
                    description: match info {
                      Some(info) => info.version.to_owned(),
                      None => "".to_owned(),
                    },
                  }
                }).collect()
              })
            },
            None => None
          };

          let transport = EventMessage {
            message_type: "event".to_owned(),
            channel: msg.channel_login.to_owned(),
            id: msg.message_id.to_owned(),
            text: msg.system_message.to_owned(),
            message: optional_message,
            timestamp: msg.server_timestamp.to_rfc2822(),
            event: msg.event,
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
    for chan in &APP_CHAT_STATE.connected_channels {
      client.join(chan.to_owned());
    }

    APP_CHAT_STATE.set_client(client);
  }
  // keep the tokio executor alive.
  // If you return instead of waiting the background task will exit.
  join_handle.await.unwrap();
}

#[command]
async fn chat_join_room(channel: String) {
  unsafe {
    APP_CHAT_STATE.join_room(channel);
  }
}

#[command]
async fn chat_leave_room(channel: String) {
  unsafe {
    APP_CHAT_STATE.leave_room(channel);
  }
}

#[command]
async fn chat_send_message(channel: String, message: String) {
  unsafe {
    APP_CHAT_STATE.send(channel, message).await;
  }
}

#[command]
fn open_link(url: String) {
  if webbrowser::open(&url).is_ok() {
    println!("opened link");
  }
}

#[command]
async fn get_userlist(channel: String) -> Option<String> {
  let request_url = format!("http://tmi.twitch.tv/group/user/{c}/chatters", c = channel);
  println!("{}", request_url);
  let response = reqwest::get(request_url).await;

  match response {
    Err(e) => {
      println!("Error fetching userlist: {}", e);
      Some("".to_owned())
    }
    Ok(r) => r.text().await.ok(),
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
      get_userlist,
      open_link
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
