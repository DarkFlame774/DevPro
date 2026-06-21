# DevPro

DevPro is a platform that automatically builds and maintains a beautiful developer profile for you by syncing with your GitHub and LeetCode accounts and much more in future.

This repository is built as a monolithic monorepo containing a Next.js frontend and an Express/Node.js backend, powered by PostgreSQL.

## Features
- **Zero Maintenance**: Connect your accounts once, and your portfolio updates automatically when you write code.
- **Data-Driven**: We algorithmically select your best projects based on stars, forks, and recent activity.
- **Premium Templates**: Switch between Professional, Minimal, and Terminal templates with one click.
- **Security-First**: Access tokens are encrypted at rest, and the API is protected against brute force.

## Project Structure

This is an npm workspace monorepo:
```
/apps
  /web       # Next.js 14 frontend (App Router)
  /api       # Node.js + Express backend
/packages
  /types     # Shared TypeScript interfaces
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Database Setup
Create a local PostgreSQL database named `devpro`.

### 2. Environment Variables
Create a `.env` file in the root directory with the following keys:
```env
# Database
DATABASE_URL=postgres://user:password@localhost:5432/devpro

# Authentication (Make sure this is a long, random string)
JWT_SECRET=super_secret_jwt_key_here

# Encryption (Must be present for AES-256-GCM token encryption)
ENCRYPTION_KEY=your_32_byte_secret_key_here

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Installation & Setup
Install all dependencies across the monorepo:
```bash
npm install
```

Run database migrations:
```bash
npm run migrate up -w apps/api
```

### 4. Running the App
Start both the frontend and backend simultaneously:
```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Architecture Notes
- **Authentication**: Email/Password + GitHub OAuth. Sessions are managed via JWT stored in HTTP-only cookies.
- **Templates**: The templates are decoupled from the data collection layer via the `ProfileGenerator` service, ensuring a strict `ProfileData` contract.
- **Syncing**: Data is pulled on-demand. GitHub data requires an OAuth access token, which is AES-256-GCM encrypted in the database.

## Built With
- Next.js (App Router, Server Components)
- Tailwind CSS
- Node.js & Express
- PostgreSQL & `node-pg-migrate`
- TypeScript
