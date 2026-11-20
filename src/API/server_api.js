import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// const ip = '192.168.1.4';

export async function apiFetch(url, options = {}) {
    // 1. Always read the token from PocketBase, never from localStorage
    let token = pb.authStore.token;

    let response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    // 2. On 401, let PocketBase refresh the token itself, then retry once
    if (response.status === 401) {
        try {
            // authRefresh validates + rotates the token and updates pb.authStore
            await pb.collection('users').authRefresh({ requestKey: null });
            token = pb.authStore.token;

            response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    ...options.headers,
                },
            });
        } catch {
            // Refresh failed → token is dead. Clear and bounce to sign-in.
            pb.authStore.clear();
            window.location.reload();
        }
    }

    if (response.status === 403) throw new Error('Insufficient permissions');
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json();
}

export async function AuthCheck() {
    try {
        const response = await fetch('/api/me', {
            credentials: 'include',
        });
        console.log('AuthCheck status:', response.status);
        return response;
    } catch (error) {
        console.error('Auth check error:', error);
        throw error;
    }
}

export async function SignInAPI({ email, password }) {
    try {
        console.log('Sending login request...');
        const response = await fetch('/api/sign_in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const data = await response.json();
        console.log('SignIn response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
}

export const SignOutAPI = async () => {
    try {
        const response = await fetch('/api/sign_out', {
            method: 'POST',
            credentials: 'include',
        });
        return response;
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
};

export async function addClient(client) {
    try {
        const response = await fetch(`http://${ip}:9000/+client`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });

        const res = await response.json();
        console.log(res);
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export const getClients = async () => {
    const res = await apiFetch(`/api/*clients`, { method: 'GET' });
    console.log('All Clients:', res);
    return res;
};

export async function deleteClient(clientId) {
    return await apiFetch(`/api/-client/${clientId}`, {
        method: 'DELETE',
    });
}

export const updateClient = async (clientId, payload) => {
    const res = await apiFetch(`/api/~client/${clientId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
    console.log('updateClient response:', res);
    return res;
};

export const getClient = async (clientId) => {
    const res = await apiFetch(`/api/getclient/${clientId}`, { method: 'GET' });
    console.log('getClient response:', res);
    return res;
};

// export async function getClient(clientId) {
//     try {
//         const response = await fetch(
//             `http://api/getclient/${clientId}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             },
//         );

//         const client = await response.json();
//         // console.log(`client: ${JSON.stringify(client)}`);
//         return client;
//     } catch (error) {
//         console.error('Error:', error);
//         return null;
//     }
// }

export async function getCoffins() {
    try {
        const response = await fetch(`api/coffins`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const coffins = await response.json();
        return coffins;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getPlans() {
    try {
        const response = await fetch(`api/plans`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const plans = await response.json();
        return plans;
    } catch (error) {
        console.error('Error:', error);
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
        console.error('Error fetching provinces:', error);
        return [];
    }
}

export async function getCities(provinceCode) {
    try {
        const res = await fetch(
            `https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`,
        );
        if (!res.ok) throw new Error('Failed to fetch cities/municipalities');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching cities/municipalities:', error);
        return [];
    }
}

export async function getBarangays(cityCode) {
    try {
        const res = await fetch(
            `https://psgc.cloud/api/cities-municipalities/${cityCode}/barangays`,
        );
        if (!res.ok) throw new Error('Failed to fetch barangays');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching barangays:', error);
        return [];
    }
}

export async function getLights() {
    try {
        const response = await fetch(`api/lights`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const lights = await response.json();
        return lights;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getAsstProviders() {
    try {
        const response = await fetch(`api/asst_providers`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const providers = await response.json();
        return providers;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function getAllClientInfos() {
    const res = await fetch(`http://${ip}:9000/clients/charges`);
    const data = await res.json();
    return data;
}
