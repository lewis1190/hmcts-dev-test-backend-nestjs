# GOV.UK Challenge - Backend API

This backend has been created with NestJS as part of the dts-developer-challenge. It implements backend system for the full CRUD of tasks as requested, as well as Firebase authentication and API documentation with Swagger.

Unit tests are implemented and passing, but not fully covered.

## Tech Stack

-   **Framework**: NestJS 11.0.1
-   **Runtime**: Node.js 22.17.0
-   **Authentication**: Firebase Admin SDK 12.3.0
-   **Testing**: Jest
-   **Documentation**: Swagger

## Important Links

### Github Repositories

-   [Frontend Repository](https://github.com/lewis1190/hmcts-dev-test-frontend-nextjs)
-   [DTS Developer Challenge Brief](https://github.com/hmcts/dts-developer-challenge)

### Hosted Links via Heroku

-   [Frontend](https://gov-challenge-frontend-8729b9eaca16.herokuapp.com/)
-   [Backend](https://gov-challenge-backend-0b9a806832f0.herokuapp.com/)
-   [Backend API Documentation](https://gov-challenge-backend-0b9a806832f0.herokuapp.com/api)

### AI Clause

AI tools were used to increase efficiency when:

-   Debugging and Scaffolding boilerplate code
-   Code reviews for best practices and optimization
-   Predictive text was also for boilerplate generation.

## Features

-   **RESTful Task API**: Full CRUD operations for task management
-   **Firebase Authentication**: Secure token-based authentication with ID token validation
-   **API Documentation**: Interactive Swagger API docs at `/api`
-   **Validation**: Request validation with error handling
-   **Testing**: Comprehensive unit testing with codecov.io for coverage reporting
-   **CORS Support**: Configurable CORS for multiple frontend origins
-   **Health Checks**: API health monitoring endpoint
-   **Error Handling**: Consistent error response format

## Project Structure

<details>

<summary>Click to view Project Structure</summary>

```
gov_challenge_backend/
├── src/
│   ├── main.ts                  # Application entry point
│   ├── app.module.ts            # Root module
│   ├── app.controller.ts        # Root controller (health check)
│   ├── app.service.ts           # Root service
│   ├── auth/
│   │   ├── auth.module.ts       # Authentication module
│   │   ├── auth.service.ts      # Firebase token validation
│   │   └── firebase.guard.ts    # Firebase JWT guard
│   ├── firebase/
│   │   ├── firebase.module.ts   # Firebase configuration
│   │   └── firebase.service.ts  # Firebase admin initialization
│   └── tasks/
│       ├── tasks.module.ts      # Tasks module
│       ├── tasks.controller.ts  # Task endpoints
│       ├── tasks.service.ts     # Task business logic
│       ├── dto/
│       │   ├── create-task.dto.ts
│       │   └── update-task.dto.ts
│       └── entities/
│           └── task.entity.ts   # Task data model
├── test/
│   ├── app.e2e-spec.ts          # End-to-end tests
│   └── jest-e2e.json            # E2E Jest configuration
├── .env                         # Environment variables
├── package.json
├── tsconfig.json
├── nest-cli.json
└── Procfile                     # Heroku deployment config
```

</details>

## Getting Set Up Locally

### Prerequisites

Ensure you have the following installed:

-   Node.js 22.17.0 or later
-   npm 10.9.2 or later
-   A Firebase project with Admin SDK credentials
-   The frontend application running locally

### Installation

1. **Clone the repository** and navigate to the project directory:

   ```bash
   cd gov_challenge_backend
   ```

2. **Set up environment variables**:

   Update `.env` with your configuration:

   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Firebase Configuration (Admin SDK)
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Set up Firebase credentials**:

   -   Download your Firebase service account JSON from Firebase Console
   -   Save it as `firebase-service-account.json` in the project root

4. **Install dependencies**:

   ```bash
   npm install
   ```

### Development

Start the development server with auto-reload:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

**API Documentation**: Visit `http://localhost:3001/api` for interactive Swagger docs

**Health Check**: `GET http://localhost:3001/health`

### Building for Production

```bash
npm run build
npm run start:prod
```

The compiled application will run from the `dist/` directory.

## Testing

### Run All Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Test Coverage Report

```bash
npm run test:cov
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Key Endpoints

#### Tasks

```
GET    /tasks                          # List all tasks
GET    /tasks/:id                      # Get task by ID
POST   /tasks                          # Create a new task
PATCH  /tasks/:id                      # Update task details
PATCH  /tasks/:id/status              # Update task status
DELETE /tasks/:id                      # Delete a task
```

All task endpoints require Firebase authentication (Bearer token in Authorization header).

## Key Implementation Details

### Firebase Authentication

Authentication is handled via Firebase Admin SDK:

-   Clients send Firebase ID tokens in the `Authorization: Bearer <token>` header
-   The `FirebaseGuard` middleware validates tokens on protected routes
-   User identification is extracted from the token for audit trails

### Task Management

Tasks are stored in memory (for demonstration) with:

-   CRUD operations via the `TasksService`
-   Status tracking (NOT_STARTED, IN_PROGRESS, COMPLETE)
-   Timestamp tracking (createdAt, updatedAt)
-   Unique ID generation per task

## What I would add beyond the MVP

With additional time, I would:

-   Add more granular error handling with custom exception filters
-   Implement request logging and monitoring for production observability
-   Expand test coverage to reach 100% (unit, integration, and e2e tests)
-   Implement rate limiting and security headers
