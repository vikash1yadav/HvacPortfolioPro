# Arctic Air Solutions - HVAC Company Website

## Overview

Arctic Air Solutions is a full-stack HVAC company website built with a modern React frontend and Express.js backend. The application features a public-facing company website with services showcase, portfolio, team information, and blog functionality, along with an admin dashboard for content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state and React hooks for local state
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom HVAC brand colors
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with consistent error handling

### Development Setup
- **Build Tool**: Vite for fast development and optimized builds
- **Bundle Strategy**: Client code bundled with Vite, server code bundled with esbuild
- **Development Server**: Hot module replacement in development mode

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL (serverless)
- **Schema**: Comprehensive schema covering company content, services, portfolio, team, blog, testimonials, and contact submissions
- **Migrations**: Drizzle Kit for schema management

### Authentication System
- **Provider**: Replit Auth integration
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: User profile storage with automatic upsert on login
- **Security**: HTTP-only cookies with secure session management

### Content Management
- **Company Content**: Flexible section-based content system
- **Services**: HVAC service catalog with descriptions and icons
- **Portfolio**: Project showcase with categories and images
- **Team Members**: Staff profiles with photos and bios
- **Blog System**: Full blog with categories, tags, and rich content
- **Testimonials**: Customer feedback with ratings
- **Contact Forms**: Lead capture with service type selection

### Public Website Features
- **Hero Section**: Dynamic content from database
- **Services Showcase**: Responsive grid layout
- **Portfolio Gallery**: Filterable project display
- **About Section**: Company information and credentials
- **Team Profiles**: Staff showcase with professional photos
- **Blog Articles**: Latest posts with category filtering
- **Customer Testimonials**: Social proof with star ratings
- **Contact Form**: Lead generation with validation

## Data Flow

### Public Content Flow
1. React components fetch data via TanStack Query
2. API endpoints serve content from PostgreSQL database
3. Fallback to default content when database is empty
4. Real-time updates when admin changes content

### Admin Management Flow
1. Admin authenticates via Replit Auth
2. Protected routes verify authentication status
3. Admin dashboard provides CRUD operations
4. Form submissions update database via API
5. Public site reflects changes immediately

### User Journey
1. **Public Visitors**: Browse company info, services, and portfolio
2. **Potential Customers**: Submit contact forms for estimates
3. **Admin Users**: Authenticate and manage all content
4. **Returning Visitors**: View updated content and blog posts

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI component primitives
- **react-hook-form**: Form state and validation
- **zod**: Runtime type validation and schema definition

### Authentication
- **openid-client**: OIDC authentication with Replit
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Server-side bundling for production
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Build Process
1. **Client Build**: Vite compiles React app to `dist/public`
2. **Server Build**: esbuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle pushes schema changes to PostgreSQL

### Environment Configuration
- **Development**: Uses tsx for hot reloading and Vite dev server
- **Production**: Serves static files from Express with bundled server code
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Authentication**: Requires Replit Auth environment variables

### Hosting
- **Platform**: Replit with autoscale deployment
- **Port**: External port 80 maps to internal port 5000
- **Process**: Single Node.js process serving both API and static files
- **Database**: Neon PostgreSQL with connection pooling

## Changelog

Changelog:
- June 22, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.