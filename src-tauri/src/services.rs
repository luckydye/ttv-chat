use twitch_irc::message::IRCMessage;

#[derive(Clone, serde::Deserialize)]
struct MessageHistory {
  messages: Vec<String>,
}

pub async fn get_message_history(channel: String) -> Result<Vec<IRCMessage>, reqwest::Error> {
  println!("Getting message history");
  let request_url = format!(
    "https://recent-messages.robotty.de/api/v2/recent-messages/{c}?clearchat_to_notice=true&limit=300",
    c = channel
  );
  let res = reqwest::get(request_url).await?;
  let body: MessageHistory = res.json().await?;

  let mut messages: Vec<IRCMessage> = vec![];

  for str in body.messages {
    match IRCMessage::parse(&str) {
      Ok(msg) => messages.push(msg),
      Err(_) => println!("Error parsing history message")
    }
  }

  Ok(messages)
}

pub async fn get_userlist(channel: String) -> Option<String> {
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
