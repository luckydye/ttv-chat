import { Component, h } from 'preact';

export default class Main extends Component {

  timer: any;
  state = {
    
  };

  constructor() {
    super();
  }

  // Lifecycle: Called whenever our component is created
  componentDidMount() {

  }

  // Lifecycle: Called just before our component will be destroyed
  componentWillUnmount() {

  }

  render() {
    return (
      <div className="">
        <notification></notification>

        <twitch-chat></twitch-chat>

        <chat-input></chat-input>
      </div>
    );
  }
}