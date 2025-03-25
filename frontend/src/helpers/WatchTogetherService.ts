import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const t2gConnetion = new HubConnectionBuilder()
  .withUrl("http://localhost:8081/WatchTogetherHub", HttpTransportType.WebSockets)
  .withAutomaticReconnect()
  .build();

function Start(): Promise<void> {
  return t2gConnetion.start();
}

async function measurePing(connection: HubConnection) {
  const start = Date.now();
  await connection.invoke("PingTest");
  const end = Date.now();

  const ping = end - start;

  return ping;
}

export default t2gConnetion;

export { Start, measurePing };
