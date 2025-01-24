# custom-url-shortener-api

## Overview

A scalable URL Shortening sevices analytics, use authentication ,and rate limiting

## Features

- 🖇️ Custom URL Shortening
- 🔐 Google OAuth Authentication
- 📑 Detailed URL Analytics
- 🚦 Rate Limiting
- 🗃️ Topic-Based URL Grouping

## Tech Stack

- **Backend:** Node.js ,Typescript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authenication:** Google Auth, JWT,
- **Caching:** Redis
- **Deployement:** Docker

## Prerequisites

- Node.js (v16+)
- PostgreSQL
- Redis
- Google OAuth Credentials

### 1. Clone Repository

```bash
git clone https://github.com/jishnusv23/custom-url-shortener-api


# Database Configuration
PORT=port
DATABASE_URL=url
GOOGLE_CLIENT_ID=id_token
JWT_SECRET=token
REDIS_URL=url
REDIS_PORT=port

REDIS_PASSWORD=password


# Development
npm run dev
# Production
npm run build
npm start


- Would you like me to customize this further ? 