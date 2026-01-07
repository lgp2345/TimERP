# Auth Module

NestJS authentication module providing JWT-based authentication, RBAC authorization, and multi-tenant support.

## Directory Structure

```
auth/
├── auth.module.ts              # Authentication module configuration and DI setup
├── auth.controller.ts          # REST API endpoints (login, refresh, logout)
├── auth.guard.ts               # JWT authentication guard
├── rbac.guard.ts               # Role-based access control guard
├── auth.decorator.ts           # Parameter decorators (CurrentUser, CurrentTenant)
├── permissions.decorator.ts    # Method decorator for requiring permissions
├── tenant.middleware.ts        # Tenant resolution middleware
├── tokens.ts                   # Dependency injection tokens
├── request-types.ts            # Extended request type definitions
└── index.ts                    # Module exports
```

## File Descriptions

- **auth.module.ts**: Main NestJS module that configures database, Redis, and auth settings. Registers controllers, guards, and middleware.

- **auth.controller.ts**: Handles authentication endpoints:
  - `POST /auth/login` - User login with username/password
  - `POST /auth/refresh` - Refresh access token using refresh token
  - `POST /auth/logout` - Revoke refresh token and clear cookie

- **auth.guard.ts**: Validates JWT Bearer tokens and attaches user claims to the request object.

- **rbac.guard.ts**: Checks user permissions against `@RequirePermissions` decorator requirements.

- **auth.decorator.ts**: Parameter decorators to inject current user and tenant context into controller methods.

- **permissions.decorator.ts**: Method decorator to declare required permissions for route handlers.

- **tenant.middleware.ts**: Extracts tenant information from HTTP Host header and attaches it to the request.

- **tokens.ts**: DI tokens for injecting database, Redis, and configuration instances.

- **request-types.ts**: Extended request type that includes tenant and user context.

- **index.ts**: Centralized exports for the module.
