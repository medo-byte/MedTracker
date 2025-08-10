# Overview

MedTracker is an AI-powered learning platform specifically designed for medical students. The application provides comprehensive tools for tracking study progress, managing notes, accessing study materials, and receiving AI-powered assistance for medical education. It combines modern web technologies with AI capabilities to create a personalized learning experience that helps medical students master complex medical knowledge more efficiently.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using **React with TypeScript** and follows a component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Framework**: Custom component library built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom design system including medical-themed colors and variables
- **Build Tool**: Vite for fast development and optimized production builds

The application uses a page-based structure with main routes for Dashboard, Study Materials, Progress tracking, AI Assistant, and Notes management.

## Backend Architecture

The backend follows a **Node.js/Express** server architecture:

- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js for HTTP server and API routing
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API endpoints organized by feature domains
- **Error Handling**: Centralized error handling middleware with structured error responses

The server implements middleware for request logging, JSON parsing, and authentication management.

## Authentication System

Uses **Replit's OIDC-based authentication** system:

- **Strategy**: OpenID Connect with Passport.js integration
- **Session Management**: Express sessions with PostgreSQL session store
- **User Management**: Automatic user creation/updates on successful authentication
- **Security**: HTTP-only cookies with secure flags for production

## Data Storage

**PostgreSQL** database with Drizzle ORM:

- **Schema Management**: Type-safe schema definitions with automatic TypeScript generation
- **Migrations**: Database schema versioning through Drizzle migrations
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Data Models**: Users, subjects, study sessions, notes, chat messages, and progress tracking

Key tables include user management (required for auth), medical subjects, study progress tracking, and AI chat history.

## AI Integration

**OpenAI GPT-4o** integration for educational assistance:

- **Medical Q&A**: Context-aware responses to medical questions with confidence scoring
- **Study Recommendations**: Personalized learning suggestions based on user progress
- **Note Enhancement**: AI-powered improvement of study notes
- **MCQ Generation**: Automated quiz creation for specific medical topics

The AI service provides structured responses with educational disclaimers and related topic suggestions.

# External Dependencies

## Core Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **@radix-ui/react-***: Comprehensive UI component primitives
- **@tanstack/react-query**: Server state management and caching
- **openai**: Official OpenAI API client for GPT-4o integration

## Authentication & Sessions

- **passport**: Authentication middleware framework
- **openid-client**: OpenID Connect client implementation
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store

## Development Tools

- **vite**: Fast build tool and development server
- **typescript**: Type safety and development experience
- **tailwindcss**: Utility-first CSS framework
- **tsx**: TypeScript execution environment

## UI & Styling

- **class-variance-authority**: Component variant management
- **tailwind-merge**: Tailwind class conflict resolution
- **lucide-react**: Icon library for consistent iconography
- **wouter**: Lightweight routing library

The application is configured for deployment on Replit with environment-specific optimizations and development tooling integration.