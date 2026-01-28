# StockFlow MVP

A clean, minimal SaaS inventory management system built with Next.js 14, SQLite, and NextAuth.js.

## Features

- ✅ Multi-tenant architecture with organization-level data isolation
- ✅ User authentication (signup/login)
- ✅ Product management (CRUD operations)
- ✅ Dashboard with inventory statistics
- ✅ Low-stock alerts with customizable thresholds
- ✅ Organization settings management
- ✅ Clean, modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: better-sqlite3 (SQLite)
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
# Clone or navigate to the project directory
cd stockflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Use

1. Navigate to `/signup` to create an account
2. Enter your organization name, email, and password
3. After signing up, log in with your credentials
4. Start managing your inventory!

## Project Structure

```
stockflow/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD endpoints
│   │   ├── dashboard/    # Dashboard data endpoint
│   │   └── settings/     # Settings endpoint
│   ├── dashboard/        # Dashboard page
│   ├── products/         # Product management pages
│   ├── settings/         # Settings page
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/
│   ├── ui/               # Reusable UI components
│   └── nav-layout.tsx    # App navigation layout
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database initialization
│   └── utils.ts          # Utility functions
└── stockflow.db          # SQLite database (auto-created)
```

## Database Schema

### Organizations
- Organization name
- Created/updated timestamps

### Users
- Email (unique)
- Password (hashed with bcrypt)
- Organization relationship

### Products
- Name, SKU (unique per organization)
- Description, quantity on hand
- Cost price, selling price
- Low stock threshold (optional)
- Organization relationship

### Settings
- Default low stock threshold
- Organization relationship

## Features in Detail

### Authentication
- Secure password hashing with bcrypt
- JWT-based sessions
- Protected routes with middleware
- Organization context in every session

### Product Management
- Create, read, update, delete products
- SKU uniqueness validation per organization
- Search by name or SKU
- Stock quantity management
- Optional low stock thresholds per product

### Dashboard
- Total products count
- Total inventory (sum of quantities)
- Low stock alerts
- Real-time updates

### Settings
- Configure default low stock threshold
- Applied to products without custom thresholds
- Organization-scoped

## Multi-Tenancy

All data is automatically scoped to the user's organization:
- Products are filtered by `organizationId`
- No cross-organization data access
- Each signup creates a new organization

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="file:./stockflow.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Resetting the Database

To start fresh, simply delete `stockflow.db` and restart the server. The schema will be automatically recreated.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Create new user & organization |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handlers |
| `/api/products` | GET | List all products |
| `/api/products` | POST | Create new product |
| `/api/products/[id]` | GET | Get single product |
| `/api/products/[id]` | PATCH | Update product |
| `/api/products/[id]` | DELETE | Delete product |
| `/api/dashboard` | GET | Get dashboard stats |
| `/api/settings` | GET | Get organization settings |
| `/api/settings` | PATCH | Update settings |

## License

MIT

## Built With

This is a 6-hour MVP built with clean, minimal code focused on core functionality.
