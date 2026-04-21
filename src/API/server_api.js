const ip = "10.0.2.88"

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
    const response = await fetch(`http://${ip}:9000/*clients`, {
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

export async function deleteClient(clientId) {
  try {
    const response = await fetch(`http://${ip}:9000/-client/${clientId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const res = await response.json();
    console.log(res);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateClient(clientId, payload) {
  console.log(payload);
  try {
    const response = await fetch(`http://${ip}:9000/~client/${clientId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const res = await response.json();
    console.log(res);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getClient(clientId) {
  try {
    const response = await fetch(`http://${ip}:9000/getclient/${clientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const client = await response.json();
    // console.log(`SERVER: ${JSON.stringify(client)}`);
    return client;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
} 
