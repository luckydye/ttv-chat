use twitch_irc::login::StaticLoginCredentials;
use twitch_irc::SecureTCPTransport;
use twitch_irc::TwitchIRCClient;
use twitch_irc::irc;

pub struct ChatApp {
  pub connected_channels: Vec<String>,
  pub chat_client: Option<TwitchIRCClient<SecureTCPTransport, StaticLoginCredentials>>,
}

impl ChatApp {
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

  pub async fn join_room(&mut self, channel_name: &String) {
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

  pub async fn delete_message(&mut self, channel_name: String, message_id: String, message: String, user: String) {
    if self.chat_client.is_some() {
      let client = self.chat_client.as_ref().unwrap();
      
      // this ain workin, idk
      let irc_msg = irc!["CLEARMSG", format!("@login={};target-msg-id={}", user, message_id), ":tmi.twitch.tv", format!("#{}", channel_name), format!(":{}", message)];

      println!("{:?}", irc_msg);

      client.send_message(irc_msg).await.unwrap();
    }
  }

  pub async fn reply(&mut self, channel_name: String, message_id: String, message: String) {
    if self.chat_client.is_some() {
      let client = self.chat_client.as_ref().unwrap();
      client.say_in_response(channel_name, message, Some(message_id)).await.unwrap();
    }
  }
}
