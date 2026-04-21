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
       $user_id = DB::table('users')->insertGetId([
            "first_name" => $request->first_name,
            "last_name" => $request->last_name,
            "address" => $request->address,
            "phone" => $request->phone,
            "email" => $request->email,
            "user_type" => $request->user_type,
            "password" => bcrypt($request->password),
        ]);
        if ($user_id) {
            if ($request->user_type == 1) {
                $firstLesson = DB::table('lesson_tb')
                    ->orderBy('lesson_id', 'asc')
                ->first();

                if ($firstLesson) {
                    DB::table('student_lesson_tb')->insert([
                        "status" => 1,
                        "user_id" => $user_id,
                        "lesson_id" => $firstLesson->lesson_id
                    ]);
                }
            }
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
