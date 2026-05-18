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
            "center_id" => $request->center_id
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

    // public function getStudents () {
    //     $students = DB::table("users")
    //         // ->where("user_type", 1)
    //         ->get();

    //     return response()->json([
    //         "status" => "success",
    //         "data" => $students
    //     ]);
    // }

   public function getStudents(Request $request)
    {
        $currentUser = DB::table('users')
            ->where('user_id', $request->user_id)
            ->first();

        // Prevent errors if user not found
        if (!$currentUser) {
            return response()->json([
                "status" => "error",
                "message" => "User not found"
            ], 404);
        }

        $query = DB::table('users')
            ->leftJoin('centers_tb', 'users.center_id', '=', 'centers_tb.center_id')
            ->select(
                'users.*',
                'centers_tb.center_name',
                'centers_tb.code_name'
            )
            ->where('users.user_type', 1);

        // Super Admin
        if ($currentUser->user_type == 2) {

            // Only filter if a specific center is selected
            if (
                $request->filled('center_id') &&
                $request->center_id != 'all'
            ) {
                $query->where('users.center_id', $request->center_id);
            }

        } else {

            // Normal admin sees only their center
            $query->where('users.center_id', $currentUser->center_id);
        }

        $students = $query->get();

        return response()->json([
            "status" => "success",
            "data" => $students
        ]);
    }
}
