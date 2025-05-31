# Auto-Login Feature for Local Development

This feature allows automatic authentication of a specific user when the application is running in the local environment. This is particularly useful for automated testing tools and frontend development without being blocked by authentication.

## How it works

The `AutoLoginAuth` middleware replaces the standard `auth` middleware for protected routes and automatically logs in a specified user when:
- `APP_ENV` is set to `local`
- `AUTO_LOGIN_USER_ID` environment variable is set
- The user is not already authenticated
- The specified user exists in the database

The middleware performs the auto-login **before** checking authentication, so there's no redirect loop - you can access protected URLs directly on the first hit.

## Setup

1. **Set environment variables in your `.env` file:**
   ```bash
   APP_ENV=local
   AUTO_LOGIN_USER_ID=1
   ```

2. **Make sure you have a user with the specified ID in your database:**
   - You can create a user through registration
   - Or use the seeder/factory to create test users

## Security

- **This feature ONLY works when `APP_ENV=local`**
- It will be completely disabled in production, staging, or any other environment
- The middleware logs all auto-login attempts for debugging purposes

## Implementation Details

- Uses a custom `AutoLoginAuth` middleware instead of Laravel's default `auth` middleware
- Registered as `auto.auth` middleware alias
- Applied to all protected routes in `routes/web.php`
- Performs auto-login first, then checks authentication in the same request cycle

## Troubleshooting

If auto-login is not working:

1. Check that `APP_ENV=local` in your `.env` file
2. Verify `AUTO_LOGIN_USER_ID` is set to a valid user ID
3. Check the Laravel logs for any error messages
4. Ensure the user exists in the database: `php artisan tinker` then `User::find(1)`
5. Clear config cache: `php artisan config:clear`

## Example Usage

```bash
# In your .env file
APP_ENV=local
AUTO_LOGIN_USER_ID=1

# Clear config cache if needed
php artisan config:clear
```

Now when you visit any protected route like `/soundboard`, you'll be automatically logged in as user ID 1 **without any redirects** - it works on the first hit!
