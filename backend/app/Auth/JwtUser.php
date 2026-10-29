<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class JwtUser implements JWTSubject, Authenticatable
{
    public function __construct(
        public int $user_id
    ) {}

    public function getJWTIdentifier()
    {
        return $this->user_id;
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function getAuthIdentifierName()
    {
        return 'user_id';
    }

    public function getAuthIdentifier()
    {
        return $this->user_id;
    }

    public function getAuthPasswordName()
    {
        return 'password';
    }

    public function getAuthPassword()
    {
        return '';
    }

    public function getRememberToken()
    {
        return '';
    }

    public function setRememberToken($value)
    {
        // Not needed for JWT authentication
    }

    public function getRememberTokenName()
    {
        return 'remember_token';
    }
}