<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    //
    public function register(Request $request)
    {
        $existingUser = DB::table('users')
            ->where('email', $request->email)
            ->first();

        if ($existingUser) {
            return response()->json([
                "status" => "error",
                "message" => "Email already exists"
            ], 409);
        }

        $userId = DB::table('users')->insertGetId([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'user_type' => 0,
        ]);

        return response()->json([
            "status" => "success",
            "message" => "User registered successfully",
            "data" => [
                "user_id" => $userId,
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "phone" => $request->phone,
                "user_type" => 0
            ]
        ]);
    }


    public function login(Request $request)
    {
        $user = DB::table('users')
            ->where('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                "status" => "error",
                "message" => "Invalid credentials"
            ], 401);
        }

        $jwtUser = new \App\Auth\JwtUser($user->user_id);

        $token = auth('api')->login($jwtUser);

        return response()->json([
            "status" => "success",
            "message" => "Login successful",
            "data" => $user,
            "token" => $token
        ]);
    }

    public function checkAdmin ()
    {
        if (session('user_type') == 0) {
            return response()->json([
                "status" => "success",
                "isAdmin" => true
            ]);
        } else {
            return response()->json([
                "status" => "error",
                "message" => "User is not admin"
            ], 403);
        }
    }
}
