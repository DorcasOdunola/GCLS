<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    //
    public function login(Request $request)
    {
        $user = DB::table('users')
            ->where('email', $request->email)
            ->first();

        if ($user && password_verify($request->password, $user->password)) {
            session([
                'user_id' => $user->user_id,
                'user_type' => $user->user_type,
            ]);

            return response()->json([
                "status" => "success",
                "message" => "Login successful",
                "data" => $user
            ]);
        } else {
            return response()->json([
                "status" => "error",
                "message" => "Invalid credentials"
            ], 401);
        }
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
