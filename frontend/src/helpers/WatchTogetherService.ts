import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

const t2gConnetion = new HubConnectionBuilder()
  .withUrl("http://localhost:8081/WatchTogetherHub", HttpTransportType.WebSockets)
  .withAutomaticReconnect()
  .build();

function Start(): Promise<void> {
  return t2gConnetion.start();
}

export default t2gConnetion;

export { Start };
