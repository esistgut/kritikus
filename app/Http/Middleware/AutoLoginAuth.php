<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AutoLoginAuth
{
    /**
     * Handle an incoming request.
     * This middleware combines auto-login functionality with authentication checking.
     */
    public function handle(Request $request, Closure $next, ...$guards): Response
    {
        // Perform auto-login first if conditions are met
        $this->performAutoLogin($request);

        // Then perform standard auth check
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                Auth::shouldUse($guard);
                return $next($request);
            }
        }

        return $this->unauthenticated($request, $guards);
    }

    /**
     * Perform auto-login if conditions are met
     */
    protected function performAutoLogin(Request $request): void
    {
        // Only run auto-login in local environment
        if (config('app.env') !== 'local') {
            return;
        }

        // Skip if user is already authenticated
        if (Auth::check()) {
            return;
        }

        // Check if AUTO_LOGIN_USER_ID is set
        $autoLoginUserId = config('app.auto_login_user_id');

        if (!$autoLoginUserId) {
            return;
        }

        try {
            // Find the user by ID
            $user = User::find($autoLoginUserId);

            if ($user) {
                // Log the user in
                Auth::login($user);

                // Regenerate session to ensure proper authentication state
                $request->session()->regenerate();

                Log::info('Auto-login performed', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'requested_url' => $request->fullUrl(),
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
    }

    /**
     * Handle an unauthenticated user.
     */
    protected function unauthenticated(Request $request, array $guards): Response
    {
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}
