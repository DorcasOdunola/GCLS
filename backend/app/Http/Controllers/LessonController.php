<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class LessonController extends Controller
{
    //
    public function getAllLesson()
    {
        $lessons = DB::table("lesson_tb")->get();

        return response()->json([
            "status" => "success",
            "data" => $lessons
        ]);
    }

    public function addLesson (Request $request)
    {
        $lesson_id = DB::table('lesson_tb')->insertGetId([
            "topic" => $request->topic,
            "sub_topic" => $request->sub_topic,
            "instructional_obj" => $request->instructional_obj,
            "subject_id" => $request->subject_id,
            "class_id" => $request->class_id
        ]);

        foreach ($request->sections as $section) {
            DB::table('lesson_section_tb')->insert([
                "section" => $section['section'],
                "lesson_id" => $lesson_id,
            ]);
        }
        return response()->json([
            "status" => "success",
            "message_lesson" => "Lesson added successfully",
            "message_section" => "Section added successfully"

        ]); 
    }

    public function getLessonSection(Request $request)
    {
        $lesson_sections = DB::table("lesson_section_tb")
            ->where("lesson_id", $request->lesson_id)
            ->get();

        return response()->json([
            "status" => "success",
            "data" => $lesson_sections
        ]);
    }

    public function getLesson(Request $request)
    {
        $lesson = DB::table("lesson_tb")
            ->where("lesson_id", $request->lesson_id)
            ->first();

        if ($lesson) {
            return response()->json([
                "status" => "success",
                "data" => $lesson
            ]);
        } else {
            return response()->json([
                "status" => "error",
                "message" => "Lesson not found"
            ], 404);
        }
    }
}
