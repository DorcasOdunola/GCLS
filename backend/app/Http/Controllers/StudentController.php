<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    //
    public function addStudent(Request $request)
    {
        //
       $addUser = DB::table('users')->insert([
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "address" => $request->address,
            "phone" => $request->phone,
            "email" => $request->email,
            "user_type" => $request->user_type,
            "password" => bcrypt($request->password),
        ]);
        if ($addUser) {
            return response()->json([
                "status" => "success",
                "message" => "User added successfully"
            ]);
        }
    }

    public function getStudents () {
        $students = DB::table("users")
            // ->where("user_type", 1)
            ->get();

        return response()->json([
            "status" => "success",
            "data" => $students
        ]);
    }
}
