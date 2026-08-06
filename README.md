# CMS — Funeral Clients Management System

A React-based web application for managing funeral service clients. Built for internal use by funeral home staff to handle client records, payments, assistance, inclusions, lights, staff assignments, and reporting.

---

## Tech Stack

- React + Vite
- Tailwind CSS
- SweetAlert2
- Lucide React (icons)
- TanStack Table

---

## Features

- **Client management** — add, view, update, and delete client records
- **Inclusions** — track items included per coffin type
- **Other charges** — itemized charges per client
- **Payments** — payment tracking with balance computation
- **Assistance** — external assistance providers (DSWD, LGU, etc.)
- **Lights & staff** — assign lights inventory and staff per client
- **Reports** — grouped reporting by client with expandable charge breakdowns
- **Authentication** — email/password login via Supabase Auth
- **Role-based access** — admins can delete; moderators can view and update
- **Session persistence** — token refresh with localStorage + httpOnly cookie

---

## Project Structure

```
CMS/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── ClientTable.jsx
│   │   ├── updateForm.jsx
│   │   ├── formSections.jsx
│   │   ├── ViewFormSections.jsx
│   │   ├── Reports.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Content.jsx
│   │   └── SignIn.jsx
│   └── API/
│       └── server_api.js
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Setup

### Prerequisites

- Node.js 18+
- Backend API running (see [CMS_BE](https://github.com/jimbros18/CMS_BE))

### Install and run

```bash
npm install
npm run dev
```

### Environment

Update the `ip` variable in `src/API/server_api.js` to point to your backend:

```javascript
const ip = '192.168.x.x:9000'; // your backend IP and port
```

---

## Roles

| Role        | Permissions                             |
| ----------- | --------------------------------------- |
| `admin`     | Full access — view, add, update, delete |
| `moderator` | View and update only — cannot delete    |

Roles are managed via the `profiles` table in Supabase.

---

## License

Internal use only — L.A.F.H Funeral Services.
