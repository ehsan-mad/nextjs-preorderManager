# Preorder Manager

Next.js app with Prisma + SQLite for managing preorders.

## Requirements

- Node.js 18+ (recommended)

## Setup

1) Install dependencies

```bash
npm install
```

2) Configure the database

Create a file named **`.env.local`** in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
```

3) Create/update the database schema

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This will create/update the SQLite DB at `prisma/dev.db`.

4) Seed sample data (optional but recommended)

```bash
node prisma/seed.js
```

The app uses `prisma/seed.js` to create sample `Preorder` records.

## Run locally

```bash
npm run dev
```

Open:
- http://localhost:3000

## Useful commands

- Open Prisma Studio (optional):
  ```bash
  npx prisma studio
  ```

- Re-seed sample data:
  ```bash
  node prisma/seed.js
  ```

