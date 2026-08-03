import { useState, useEffect } from 'react';

const ip = "10.0.2.88"
// const ip = '192.168.1.3';

// const token = localStorage.getItem('token');

async function refreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');
    const res = await fetch(`/api/refresh_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token })
    });
    if (!res.ok) throw new Error('Session expired');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refresh_token', data.refresh_token);

    if (!localStorage.getItem('userData') && data.user) {
        localStorage.setItem('userData', JSON.stringify({
            user: data.user,
            username: data.username,
            branch: data.branch,
            role: data.role
        }));
    }
    return data.token;
}

export async function apiFetch(url, options = {}) {
    let token = localStorage.getItem('token');
    let response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    if (response.status === 401) {
        try {
            token = await refreshToken();
            response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...options.headers
                }
            });
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userData');
            document.cookie = 'isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.reload();
        }
    }

    if (response.status === 403) throw new Error('Insufficient permissions');
    if (!response.ok) throw new Error('Request failed');
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
        return true
    } catch (error) {
        console.error('Error:', error);
        return false
    }
}

// export async function getClients() {
//     try {
//         const response = await fetch(`/api/*clients`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         const clients = await response.json();
//         console.log('SERVER: ', clients);
//         return clients;
//     } catch (error) {
//         console.error('Error:', error);
//         return [];
//     }
// }

export const getClients = async () => {
    const clients = await apiFetch(`/api/*clients`, { method: 'GET' });
    return clients;
}

export async function deleteClient(clientId) {
    try {
        const response = await fetch(`http://${ip}:9000/-client/${clientId}`, {
            method: 'DELETE',
            headers: {
                // 'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
        });
        if (response.status === 403) throw new Error('Insufficient permissions');
        if (response.status === 401) throw new Error('Unauthorized');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
}

// export async function updateClient(clientId, payload) {
//     // console.log(payload);
//     try {
//         const response = await fetch(`http://${ip}:9000/~client/${clientId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                  "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify(payload),
//         });

//         const res = await response.json();
//         console.log(res);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

export const updateClient = async (clientId, payload) => {
    return await apiFetch(`/api/~client/${clientId}`,{method: 'PUT', body: JSON.stringify(payload),})
}

export async function getClient(clientId) {
    try {
        const response = await fetch(
            `http://${ip}:9000/getclient/${clientId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        const client = await response.json();
        // console.log(`SERVER: ${JSON.stringify(client)}`);
        return client;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function getCoffins() {
    try {
        const response = await fetch(`http://${ip}:9000/coffins`, {
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
        const response = await fetch(`http://${ip}:9000/plans`, {
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
        const response = await fetch(`http://${ip}:9000/lights`, {
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
        const response = await fetch(`http://${ip}:9000/asst_providers`, {
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
