# Auto-Login Feature for Local Development

This feature allows automatic authentication of a specific user when the application is running in the local environment. This is particularly useful for automated testing tools and frontend development without being blocked by authentication.

## How it works

The `AutoLoginMiddleware` automatically logs in a specified user when:
- `APP_ENV` is set to `local`
- `AUTO_LOGIN_USER_ID` environment variable is set
- The user is not already authenticated
- The specified user exists in the database

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

## Troubleshooting

If auto-login is not working:

1. Check that `APP_ENV=local` in your `.env` file
2. Verify `AUTO_LOGIN_USER_ID` is set to a valid user ID
3. Check the Laravel logs for any error messages
4. Ensure the user exists in the database: `php artisan tinker` then `User::find(1)`

## Example Usage

```bash
# In your .env file
APP_ENV=local
AUTO_LOGIN_USER_ID=1

# Clear config cache if needed
php artisan config:clear
```

Now when you visit any protected route, you'll be automatically logged in as user ID 1.
