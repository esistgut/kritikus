<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AutoLoginMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only run auto-login in local environment
        if (config('app.env') !== 'local') {
            return $next($request);
        }

        // Skip if user is already authenticated
        if (Auth::check()) {
            return $next($request);
        }

        // Check if AUTO_LOGIN_USER_ID is set
        $autoLoginUserId = config('app.auto_login_user_id');

        if (!$autoLoginUserId) {
            return $next($request);
        }

        try {
            // Find the user by ID
            $user = User::find($autoLoginUserId);

            if ($user) {
                // Log the user in
                Auth::login($user);

                Log::info('Auto-login performed', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            } else {
                Log::warning('Auto-login failed: User not found', [
                    'user_id' => $autoLoginUserId,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Auto-login failed with exception', [
                'user_id' => $autoLoginUserId,
                'error' => $e->getMessage(),
            ]);
        }

        return $next($request);
    }
}
