#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use webbrowser;

use tauri::command;
use tauri::Manager;

use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::message::ServerMessage;
use twitch_irc::TwitchIRCClient;
use twitch_irc::{ClientConfig, SecureTCPTransport};

use std::convert::TryFrom;

mod app;
mod messages;
mod services;

use app::ChatApp;

static mut APP_CHAT: ChatApp = ChatApp {
  connected_channels: vec![],
  chat_client: None,
};

pub fn handle_server_message(message: ServerMessage, app_handle: &tauri::AppHandle) {
  match message {
    ServerMessage::Privmsg(msg) => {
      let transport = messages::handle_priv_message(msg);
      app_handle.emit_all("chat.message", transport).unwrap();
    }
    ServerMessage::UserState(msg) => {
      let transport = messages::handle_user_state_message(msg);
      app_handle.emit_all("chat.user", transport).unwrap();
    }
    ServerMessage::Whisper(msg) => {
      messages::handle_whisper_message(msg);
    }
    ServerMessage::GlobalUserState(msg) => {
      messages::handle_global_user_state_message(msg);
    }
    ServerMessage::RoomState(msg) => {
      // messages::handle_RoomStateMessage(msg);
      app_handle.emit_all("chat.state", msg).unwrap();
    }
    ServerMessage::ClearMsg(msg) => {
      // message deletes
      app_handle.emit_all("chat.delete.message", msg).unwrap();
    }
    ServerMessage::ClearChat(msg) => {
      // message deletes
      // messages::handle_ClearChatMessage(msg);
      app_handle.emit_all("chat.clear", msg).unwrap();
    }
    ServerMessage::UserNotice(msg) => {
      // sub messages and stuff
      let transport = messages::handle_user_notice_message(msg);
      app_handle.emit_all("chat.info", transport).unwrap();
    }
    ServerMessage::Notice(msg) => {
      app_handle.emit_all("chat.notice", msg).unwrap();
    }
    ServerMessage::Join(msg) => {
      app_handle.emit_all("chat.joined", msg).unwrap();
    }
    ServerMessage::Part(msg) => {
      app_handle.emit_all("chat.parted", msg).unwrap();
    }
    msg => {
      println!("{:?}", msg);
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
  let join_handle = tokio::spawn(async move {
    while let Some(message) = incoming_messages.recv().await {
      // println!("Received message: {:?}", message);
      handle_server_message(message, &app_handle);
    }
  });

  unsafe {
    for chan in &APP_CHAT.connected_channels {
      client.join(chan.to_owned());
    }

    APP_CHAT.set_client(client);
  }
  join_handle.await.unwrap();
}

#[command]
async fn chat_join_room(app_handle: tauri::AppHandle, channel: String) {
  unsafe {
    APP_CHAT.join_room(&channel).await;

    match services::get_message_history(channel.to_owned()).await {
      Ok(messages) => {
        for irc_message in messages {
          let server_message = ServerMessage::try_from(irc_message).unwrap();
          handle_server_message(server_message, &app_handle);
        }
      }
      Err(e) => {
        println!("Error fetching hisotry: {}", e);
      }
    }
  }
}

#[command]
fn chat_leave_room(channel: String) {
  unsafe {
    APP_CHAT.leave_room(channel);
  }
}

#[command]
async fn chat_send_message(channel: String, message: String) {
  unsafe {
    APP_CHAT.send(channel, message).await;
  }
}

#[command]
async fn chat_delete_message(
  channel_name: String,
  message_id: String,
  message: String,
  user: String,
) {
  unsafe {
    APP_CHAT
      .delete_message(channel_name, message_id, message, user)
      .await;
  }
}

#[command]
async fn chat_reply(channel: String, message_id: String, message: String) {
  unsafe {
    APP_CHAT.reply(channel, message_id, message).await;
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
  services::get_userlist(channel).await
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      connect_to_chat,
      chat_join_room,
      chat_leave_room,
      chat_send_message,
      chat_delete_message,
      chat_reply,
      get_userlist,
      open_link
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
