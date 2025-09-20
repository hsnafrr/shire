# Overview

This is a modern full-stack blog application built with React, Express, and PostgreSQL. The application features a Lord of the Rings/Middle-earth theme and provides a complete content management system with public blog viewing and admin functionality. The system supports user authentication through Replit's OIDC service, rich text editing for blog posts, and a contact form for visitor inquiries.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: TailwindCSS with a custom Middle-earth themed design system
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit OIDC integration with Passport.js strategy
- **Session Management**: Express sessions stored in PostgreSQL using connect-pg-simple

## Data Storage Solutions
- **Primary Database**: PostgreSQL (Neon serverless) for all application data
- **ORM**: Drizzle ORM with automatic TypeScript type generation
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL table-based sessions for authentication state

## Authentication and Authorization
- **Authentication Provider**: Replit OIDC (OpenID Connect)
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Authorization**: Role-based access control distinguishing between public users and authenticated admins
- **Security**: HTTP-only cookies for session management with CSRF protection

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Custom WebSocket constructor for Neon serverless compatibility

### Authentication Services
- **Replit OIDC**: Primary authentication provider using OpenID Connect protocol
- **Passport.js**: Authentication middleware for Express.js applications

### Development and Build Tools
- **Vite**: Frontend build tool with React plugin and development server
- **Replit Plugins**: Development-specific plugins for error overlay, cartographer, and dev banner
- **TypeScript**: Type checking and compilation for both frontend and backend
- **ESBuild**: Backend bundling for production builds

### UI and Styling
- **Google Fonts**: Custom font integration (Cinzel, Georgia, and other thematic fonts)
- **Radix UI**: Headless UI component primitives for accessibility
- **TailwindCSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Icon library for consistent iconography

### Form and Content Management
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Rich Text Editor**: Custom markdown-style editor for blog content creation