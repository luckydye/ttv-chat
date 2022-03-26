use std::collections::HashSet;
use twitch_irc::message::Badge;
use twitch_irc::message::Emote;
use twitch_irc::message::IRCTags;
use twitch_irc::message::UserNoticeEvent;

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
pub struct FullBadge {
  name: String,
  version: String,
  description: String,
}

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
pub struct ChatClearMessage {
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
pub struct ChatUser {
  channel: String,
  username: String,
  badges: Vec<Badge>,
  badge_info: Vec<Badge>,
  name_color: Vec<u8>,
  emote_sets: HashSet<u64>,
}

///////////////////
/// new interfaces

// the payload type must implement `Serialize`.
// for global events, it also must implement `Clone`.
#[derive(Clone, serde::Serialize)]
pub struct UserMessage {
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
pub struct EventMessage {
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

pub fn handle_priv_message(msg: twitch_irc::message::PrivmsgMessage) -> UserMessage {
  let mut badge_info_it = msg.badge_info.iter();
  UserMessage {
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
      .map(|badge| FullBadge {
        name: badge.name.to_owned(),
        version: badge.version.to_owned(),
        description: if badge.name == "subscriber" {
          match badge_info_it.next() {
            Some(info) => info.version.to_owned(),
            None => "".to_owned(),
          }
        } else {
          "".to_owned()
        },
      })
      .collect(),
  }
}

pub fn handle_user_state_message(msg: twitch_irc::message::UserStateMessage) -> ChatUser {
  ChatUser {
    channel: msg.channel_login.to_owned(),
    username: msg.user_name.to_owned(),
    badges: msg.badges,
    badge_info: msg.badge_info,
    emote_sets: msg.emote_sets,
    name_color: match msg.name_color {
      Some(nc) => {
        vec![nc.r, nc.g, nc.b]
      }
      None => vec![240u8, 240u8, 240u8],
    },
  }
}

pub fn handle_whisper_message(msg: twitch_irc::message::WhisperMessage) {
  println!("(whisper) {}: {}", msg.sender.name, msg.message_text);
}

pub fn handle_global_user_state_message(msg: twitch_irc::message::GlobalUserStateMessage) {
  println!("(user) {}", msg.user_id);
}

// pub fn handle_room_state_message(msg: twitch_irc::message::RoomStateMessage) {}

pub fn handle_clear_message(msg: twitch_irc::message::ClearMsgMessage) -> ChatClearMessage {
  ChatClearMessage {
    id: msg.message_id.to_owned(),
    message: msg.message_text.to_owned(),
    sender: msg.sender_login.to_owned(),
    channel: msg.channel_login.to_owned(),
    is_action: false,
    server_timestamp: msg.server_timestamp.to_rfc2822(),
  }
}

// pub fn handle_clear_chat_message(msg: twitch_irc::message::ClearChatMessage) {}

pub fn handle_user_notice_message(msg: twitch_irc::message::UserNoticeMessage) -> EventMessage {
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
      })
    }
    None => None,
  };

  EventMessage {
    message_type: "event".to_owned(),
    channel: msg.channel_login.to_owned(),
    id: msg.message_id.to_owned(),
    text: msg.system_message.to_owned(),
    message: optional_message,
    timestamp: msg.server_timestamp.to_rfc2822(),
    event: msg.event,
  }
}

// pub fn handle_user_notice(msg: twitch_irc::message::NoticeMessage) {}

// pub fn handle_join_message(msg: twitch_irc::message::JoinMessage) {}
