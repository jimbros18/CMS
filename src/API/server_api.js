const ip = "192.168.0.116"

export async function addClient(client) {
  try {
    const response = await fetch(`http://${ip}:9000/+client`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(client)
    });

    const res = await response.json();
    console.log(res);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getClients() {
  try {
    const response = await fetch(`http://${ip}:9000/clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const clients = await response.json();
    console.log(`SERVER: ${JSON.stringify(clients)}`);
    return clients;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
