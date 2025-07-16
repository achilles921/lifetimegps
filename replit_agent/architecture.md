# CareerPathAI Architecture

## Overview

CareerPathAI is a web application designed to help users discover suitable career paths through AI-powered assessments, interactive quizzes, mini-games, and personalized roadmaps. The application follows a modern full-stack architecture with a React frontend and a Node.js Express backend. It leverages AI technologies for career recommendations and includes voice guidance features through integration with the ElevenLabs API.

## System Architecture

### High-Level Architecture

The system follows a client-server architecture:

1. **Frontend**: React-based single-page application (SPA) with TypeScript
2. **Backend**: Node.js with Express framework
3. **Database**: PostgreSQL (via Neon Database's serverless offering)
4. **ORM**: Drizzle ORM for type-safe database operations
5. **API**: RESTful API endpoints for data exchange between client and server
6. **External Services**: Integration with ElevenLabs for text-to-speech, Anthropic for AI capabilities

```
┌────────────────┐           ┌────────────────┐         ┌─────────────────┐
│                │           │                │         │                 │
│    Frontend    │◄─────────►│    Backend     │◄────────►     Database    │
│   (React/TS)   │    REST   │  (Express/TS)  │  Drizzle │  (PostgreSQL)   │
│                │    API    │                │         │                 │
└────────────────┘           └───────┬────────┘         └─────────────────┘
                                     │
                                     ▼
                             ┌───────────────┐
                             │  External APIs │
                             │  - ElevenLabs  │
                             │  - Anthropic   │
                             └───────────────┘
```

## Key Components

### Frontend

- **Technology Stack**: React, TypeScript, Tailwind CSS, shadcn/ui components
- **State Management**: React Query for server state, React Context for application state
- **Routing**: Wouter (lightweight alternative to React Router)
- **Key Components**:
  - Quiz system with a "racing" theme
  - Interactive mini-games for skill assessment
  - Career roadmap visualization
  - Voice-guided interface
  - Dashboard for displaying career matches and recommendations

### Backend

- **Technology Stack**: Node.js, Express, TypeScript
- **API Structure**: RESTful endpoints organized by functionality:
  - `/api/auth/*` - Authentication routes
  - `/api/activity/*` - User activity tracking
  - `/api/voice/*` - Text-to-speech functionality
  - `/api/mini-games/*` - Mini-game results and metrics
  - `/api/*` - General data endpoints (read/write)

- **Key Services**:
  - `elevenLabsService.ts` - Text-to-speech integration
  - `cacheService.ts` - Performance optimization via caching
  - `activityStorage.ts` - User activity tracking and analysis
  - `optimizedCacheService.ts` - Memory-efficient caching system
  - `gamificationService.ts` - Achievement and progression tracking
  - `serendipityEngine.ts` - Discovery system for career opportunities

### Database

- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Connection**: Neon Database serverless PostgreSQL
- **Key Schemas**:
  - Users and authentication
  - Quiz responses and user preferences
  - Career roadmaps and matches
  - Activity events for analytics
  - Learning achievements and gamification
  - Shadowing opportunities

### API Layer

- **RESTful API**: Organized into modules:
  - Read routes for data retrieval (with caching)
  - Write routes for data modification
  - Authentication routes
  - Activity tracking routes
  - Voice synthesis routes
  - Mini-game metrics routes

## Data Flow

1. **User Interaction Flow**:
   - User completes personality and interest assessments
   - User plays mini-games for additional metrics
   - System analyzes data using career matching algorithm
   - System generates personalized career roadmaps
   - User explores recommended careers with voice guidance

2. **Data Processing Flow**:
   - Quiz responses analyzed by `quizLogic.ts`
   - Mini-game results processed by `MiniGameService.ts`
   - Career matches generated based on composite profile
   - Activity data stored for future analysis
   - Caching layer optimizes repeated data access

3. **Voice Guidance Flow**:
   - Text content for voice guidance is generated
   - `elevenLabsService.ts` converts text to speech
   - `speechOptimizationService.ts` manages token usage and caching
   - Audio streamed to the client for playback

## External Dependencies

### Third-Party Services

- **ElevenLabs API**: Text-to-speech functionality
- **Anthropic API**: AI-powered insights (Claude integration)
- **Neon Database**: Serverless PostgreSQL database
- **Stripe**: Payment processing (integration visible in package.json)

### Key Libraries and Frameworks

- **Frontend**:
  - React for UI
  - Tailwind CSS for styling
  - shadcn/ui for UI components
  - React Query for data fetching
  - Wouter for routing

- **Backend**:
  - Express for API server
  - Drizzle ORM for database operations
  - zod for validation
  - WebSockets for real-time features

## Deployment Strategy

The application is configured for deployment on Replit:

- **Build Process**:
  - Frontend: Vite for bundling and optimization
  - Backend: esbuild for TypeScript compilation
  - Combined process via the `build` script in package.json

- **Runtime**:
  - Node.js for server execution
  - Static assets served by Express
  - Database accessed via pooled connections

- **Development Mode**:
  - Development server with hot module replacement
  - Environment-aware configuration
  - In-memory caching for development

- **Production Mode**:
  - Optimized builds
  - Persistent caching
  - Log sanitization

- **Infrastructure**:
  - Configured for Replit autoscaling deployment
  - PostgreSQL database via Neon serverless

## Design Decisions and Trade-offs

### Monorepo Structure

**Decision**: Organize as a monorepo with client and server in the same repository.

**Rationale**: Simplifies development workflow, enables shared types between frontend and backend, and simplifies deployment on Replit.

**Trade-offs**: 
- Pros: Better type safety across stack, easier to maintain consistency
- Cons: Larger repository size, potential for complexity in build process

### Drizzle ORM with Neon Database

**Decision**: Use Drizzle ORM with Neon's serverless PostgreSQL.

**Rationale**: Provides type safety, schema migrations, and works well with serverless architecture.

**Trade-offs**:
- Pros: Type safety, good performance, serverless compatibility
- Cons: Newer ORM with smaller community than established options like Prisma

### Custom Caching Layer

**Decision**: Implement a sophisticated caching system with TTL and LRU eviction.

**Rationale**: Optimize performance for frequently accessed data while managing memory usage.

**Trade-offs**:
- Pros: Better performance, reduced API calls, controlled memory usage
- Cons: Additional complexity, potential cache invalidation challenges

### Voice Guidance with ElevenLabs

**Decision**: Integrate ElevenLabs for text-to-speech.

**Rationale**: Provides high-quality, natural-sounding voices with good multilingual support.

**Trade-offs**:
- Pros: Superior voice quality, variety of voices
- Cons: External dependency, potential cost scaling with usage

### Mini-Games for Assessment

**Decision**: Use interactive mini-games to gather additional user metrics.

**Rationale**: Provides more nuanced data about cognitive styles, preferences, and aptitudes than traditional questionnaires alone.

**Trade-offs**:
- Pros: Richer user profiles, more engaging experience
- Cons: Development complexity, potential accessibility challenges

## Future Architectural Considerations

1. **Scaling Strategy**:
   - Implement more robust caching strategies
   - Consider microservices architecture for specific components like voice synthesis
   - Optimize database queries for larger user base

2. **Security Enhancements**:
   - Strengthen authentication mechanisms
   - Implement API rate limiting
   - Add comprehensive data encryption

3. **Performance Optimization**:
   - Implement server-side rendering for critical pages
   - Further optimize asset loading
   - Consider edge caching for global performance