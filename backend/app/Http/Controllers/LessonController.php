<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class LessonController extends Controller
{
    //
    public function getAllLesson()
    {
        $lessons = DB::table("lesson_tb")
        ->get(); 
        return response()->json([ 
            "status" => "success", 
            "data" => $lessons 
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

    public function getAllLessonForStudent(Request $request)
    {
        $studentId = $request->user_id;

        $lessons = DB::table('lesson_tb as l')
            ->leftJoin('student_lesson_tb as sl', function ($join) use ($studentId) {
                $join->on('l.lesson_id', '=', 'sl.lesson_id')
                    ->where('sl.user_id', '=', $studentId);
            })
            ->select(
                'l.*',
                DB::raw("
                    CASE 
                        WHEN sl.lesson_id IS NULL THEN 'locked'
                        WHEN sl.status = 1 THEN 'in_progress'
                        WHEN sl.status = 2 THEN 'completed'
                        ELSE 'locked'
                    END as lesson_status
                ")
            )
            ->orderBy('l.lesson_id', 'asc')
            ->get();

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

    public function endLesson(Request $request)
    {
        $studentId = $request->user_id;
        $lessonId = $request->lesson_id;

        // Check if the record exists
        $record = DB::table('student_lesson_tb')
            ->where('user_id', $studentId)
            ->where('lesson_id', $lessonId)
            ->first();

        if ($record) {
            // Update the existing record to mark as completed
            DB::table('student_lesson_tb')
                ->where('user_id', $studentId)
                ->where('lesson_id', $lessonId)
                ->update(['status' => 2]); // 2 means completed
        } else {
            // Insert a new record to mark as completed
            DB::table('student_lesson_tb')->insert([
                'user_id' => $studentId,
                'lesson_id' => $lessonId,
                'status' => 2 // 2 means completed
            ]);
        }

        return response()->json([
            "status" => "success",
            "message" => "Lesson marked as completed"
        ]);
    }
}
