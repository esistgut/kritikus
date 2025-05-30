<?php

namespace App\Policies;

use App\Models\Sound;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SoundPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view their own sounds
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Sound $sound): bool
    {
        return $user->id === $sound->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // All authenticated users can create sounds
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Sound $sound): bool
    {
        return $user->id === $sound->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Sound $sound): bool
    {
        return $user->id === $sound->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Sound $sound): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Sound $sound): bool
    {
        return false;
    }
}
