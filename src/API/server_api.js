import { useState, useEffect } from 'react';

const ip = "10.0.2.88"
// const ip = "192.168.0.105"

export async function SignInAPI({ email, password }) {
    console.log('sending:', { email, password }); // ✅ check this
    const response = await fetch(`http://${ip}:9000/sign_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

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
    console.log('SERVER: ', clients);
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

export async function getCoffins() {
  try {
    const response = await fetch(`http://${ip}:9000/coffins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const coffins = await response.json();
    return coffins;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getPlans() {
  try {
    const response = await fetch(`http://${ip}:9000/plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const plans = await response.json();
    return plans;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getProvinces() {
  try {
    const res = await fetch(`https://psgc.cloud/api/provinces`);
    if (!res.ok) throw new Error('Failed to fetch provinces');
    
    const data = await res.json();
    return Array.isArray(data) 
        ? data.sort((a, b) => a.name.localeCompare(b.name)) 
        : [];
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return [];
  }
}

export async function getCities(provinceCode) {
  try {
      const res = await fetch(`https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`);
      if (!res.ok) throw new Error('Failed to fetch cities/municipalities');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
  }
  catch (error) {
      console.error("Error fetching cities/municipalities:", error);
      return [];
  }
}

export async function getBarangays(cityCode) {
  try {
      const res = await fetch(`https://psgc.cloud/api/cities-municipalities/${cityCode}/barangays`);
      if (!res.ok) throw new Error('Failed to fetch barangays');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
  }
  catch (error) {
      console.error("Error fetching barangays:", error);
      return [];  
  }
}

export async function getLights() {
  try {
    const response = await fetch(`http://${ip}:9000/lights`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const lights = await response.json();
    return lights;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getAsstProviders() {
  try {
    const response = await fetch(`http://${ip}:9000/asst_providers`, {
    method: "GET", 
    headers: {"Content-Type": "application/json"}
    });
    const providers = await response.json();
    return providers;
  }catch (error) {
    console.error("Error:", error);
    return [];
  }
  
  
}

export async function getAllClientInfos() {
    const res = await fetch(`http://${ip}:9000/clients/charges`);
      const data = await res.json();
    return data;
}