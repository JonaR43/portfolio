# Portfolio CMS Backend

Backend API for the portfolio admin panel built with Fastify + Prisma + PostgreSQL.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or pnpm

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL Database

Create a PostgreSQL database for the project:

```bash
# Using psql
createdb portfolio

# Or using Docker
docker run --name portfolio-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  -d postgres:16
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio"
JWT_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

**Generate secure JWT secrets:**
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations

```bash
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
npm run db:seed      # Seed initial data
```

This will create:
- Admin user: `admin@portfolio.com` / `admin123` (CHANGE THIS!)
- 5 projects from your current portfolio
- About section with your info
- Contact info
- Site settings

### 5. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

## API Endpoints

### Public Routes
- `GET /api/projects` - List all published projects
- `GET /api/projects/:id` - Get single project
- `GET /api/about` - Get about section
- `GET /api/contact` - Get contact info

### Admin Routes (Requires Authentication)
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project
- `PUT /api/admin/about` - Update about section
- `PUT /api/admin/contact` - Update contact info

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (DB GUI)

## Development

### Testing API with curl

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123"}'

# Get projects
curl http://localhost:3000/api/projects

# Create project (requires auth token)
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"TEST-01","title":"Test Project","description":"...","tech":["React"],"gallery":[]}'
```

## Security Notes

- ⚠️ **Change the default admin password immediately after first login!**
- Keep `.env` file secret and never commit it to git
- Use strong, unique JWT secrets (32+ characters)
- In production, use HTTPS only
- Configure CORS to your specific frontend domain

## Next Steps

1. Complete the Fastify server implementation (server.ts, routes, controllers)
2. Implement authentication middleware
3. Implement CRUD endpoints for projects/about/contact
4. Add image upload with Cloudinary
5. Deploy to Railway/Render

## Database Schema

See `prisma/schema.prisma` for the complete database schema including:
- Users & Authentication (JWT tokens)
- Projects (with gallery, tech stack, links)
- About Section (bio, education, skills)
- Contact Info
- Site Settings (theme colors)
