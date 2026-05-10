# Backend

Server application source lives here.

## Structure

- `src/config/` - environment and service configuration
- `src/controllers/` - request handlers
- `src/middleware/` - Express middleware
- `src/models/` - database models and schemas
- `src/routes/` - API route definitions
- `src/services/` - business logic and integrations
- `src/utils/` - backend utility functions
- `src/validators/` - request validation schemas
- `database/` - SQL schema and database setup files
- `tests/` - backend tests
- `uploads/` - local uploaded files during development

## Database

Set `DATABASE_URL` to your PostgreSQL connection string and run `database/schema.sql` before starting the API.

## API Areas

- `/api/auth` - login, register, current user
- `/api/users` - profile
- `/api/trips` - trip listing and planning
- `/api/itineraries` - itinerary builder
- `/api/expenses` - budget and expense tracking
- `/api/packing` - packing checklist
- `/api/notes` - trip notes and journal
- `/api/community` - shared trip/activity posts
- `/api/invoices` - invoice and payment status
- `/api/admin` - admin dashboard, users, and analytics

