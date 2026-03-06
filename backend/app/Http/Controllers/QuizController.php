<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    //
    public function createQuiz(Request $request)
    {
        //
        $quiz_id = DB::table('quiz_tb')->insertGetId([
            "quiz_title" => $request->quiz_title,
            "instructions" => $request->instructions,
            "duration" => $request->duration,
            "lesson_id" => $request->lesson_id,
        ]); 
        if (!$quiz_id) {
            return response()->json([
                "status" => "error",
                "message" => "Failed to create quiz"
            ], 500);
        }   
        return response()->json([
            "status" => "success",
            "message" => "Quiz created successfully",
            "quiz_id" => $quiz_id
        ]); 
    }

    public function getAllQuiz()
    {

        $quizzes = DB::table('quiz_tb')
            ->join('lesson_tb', 'lesson_tb.lesson_id', '=', 'quiz_tb.lesson_id')
            ->leftJoin('quiz_question', 'quiz_question.quiz_id', '=', 'quiz_tb.quiz_id')
            ->select(
                'quiz_tb.quiz_id',
                'quiz_tb.quiz_title',
                'quiz_tb.created_at',
                'quiz_tb.instructions',
                'quiz_tb.duration',
                'lesson_tb.topic as lesson_topic',
                DB::raw('COALESCE(COUNT(quiz_question.quiz_question_id), 0) as questions_count')
            )
        ->groupBy(
            'quiz_id',
            'quiz_title',
            'quiz_tb.created_at',
            'quiz_tb.instructions',
            'quiz_tb.duration',
            'lesson_tb.topic'
        )
        ->get();
        return response()->json([
            "status" => "success",
            "data" => $quizzes
        ]); 
    }

    public function getQuiz (Request $request) {
        //

        $quizId = $request->quiz_id;

        // Get the quiz
        $quiz = DB::table('quiz_tb')
            ->join('lesson_tb', 'quiz_tb.lesson_id', '=', 'lesson_tb.lesson_id')
            ->where('quiz_tb.quiz_id', $quizId)
            ->select(
                'quiz_tb.*',
                'lesson_tb.topic'
            )
        ->first();

        if (!$quiz) {
            return response()->json([
                'message' => 'Quiz not found'
            ], 404);
        }

        // Get related questions
        $questions = DB::table('quiz_question')
            ->where('quiz_id', $quizId)
            ->get();

        // Attach questions array to quiz object
        $quiz->questions = $questions;

        return response()->json([
            "status" => "success",
            "data" => $quiz
        ]);
    }

    public function updateQuiz (Request $request) {
        //
        $updated = DB::table('quiz_tb')
            ->where('quiz_id', $request->quiz_id)
            ->update([
                "quiz_title" => $request->quiz_title,
                "instructions" => $request->instructions,
                "duration" => $request->duration,
                "lesson_id" => $request->lesson_id
            ]);
        if (!$updated) {
            return response()->json ([
                "status" => "error",
                "message" => "Failed to update quiz"
            ], 500);
        }
        return response()->json ([
            "status" => "success",
            "message" => "Quiz updated successfully"
        ]);
    }

    public function addQuestion (Request $request) {
        //
        $inserted = DB::table('quiz_question')->insert([
            "quiz_id" => $request->quiz_id,
            "question" => $request->question,
            "option_a" => $request->option_a,
            "option_b" => $request->option_b,
            "option_c" => $request->option_c,
            "option_d" => $request->option_d,
            "correct_option" => $request->correct_option,
            "feedback" => $request->feedback,
        ]);
        if (!$inserted) {
            return response()->json ([
                "status" => "error",
                "message" => "Failed to add question"
            ], 500);
        }
        return response()->json ([
            "status" => "success",
            "message" => "Question added successfully"
        ]);
    }

    public function updateQuestion (Request $request) {
        //
        $updated = DB::table('quiz_question')
            ->where('quiz_question_id', $request->quiz_question_id)
            ->update([
                "question" => $request->question,
                "option_a" => $request->option_a,
                "option_b" => $request->option_b,
                "option_c" => $request->option_c,
                "option_d" => $request->option_d,
                "correct_option" => $request->correct_option,
                "feedback" => $request->feedback,
            ]);
        if (!$updated) {
            return response()->json ([
                "status" => "error",
                "message" => "Failed to update question"
            ], 500);
        }
        return response()->json ([
            "status" => "success",
            "message" => "Question updated successfully"
        ]);
    }

    public function createQuizAttempt (Request $request) {
        $request->validate([
            'quiz_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        // Check for existing attempt
        $existingAttempt = DB::table('quiz_attempt_tb')
            ->where('quiz_id', $request->quiz_id)
            ->where('user_id', $request->user_id)
        ->first();

        if ($existingAttempt) {
            return response()->json([
                "status" => "success",
                "message" => "Quiz attempt already exists",
                "quiz_attempt" => $existingAttempt
            ]);
        }
        //
        $quiz_attempt_id = DB::table('quiz_attempt_tb')->insertGetId([
            "score" => $request->score,
            "status" => $request->status,
            "quiz_id" => $request->quiz_id,
            "user_id" => $request->user_id,
        ]);
        if (!$quiz_attempt_id) {
            return response()->json ([
                "status" => "error",
                "message" => "Failed to create quiz attempt"
            ], 500);
        } else {
            $questions = DB::table('quiz_question')
                ->where('quiz_id', $request->quiz_id)
                ->inRandomOrder()
            ->get();

            $order = 1;

            foreach ($questions as $question) {
                DB::table('quiz_answer_tb')->insert([
                    'quiz_attempt_id' => $quiz_attempt_id,
                    'quiz_question_id' => $question->quiz_question_id,
                    'correct_option' => $question->correct_option,
                    'question_order' => $order
                ]);

                $order++;
            }
        }
        return response()->json ([

            "status" => "success",
            "message" => "Quiz attempt created successfully",
            "quiz_attempt_id" => $quiz_attempt_id
        ]);
    }

    public function getStudentQuizAttempt (Request $request) {
        //
        $quiz_attempts = DB::table('quiz_attempt_tb')
            ->join('users', 'quiz_attempt_tb.user_id', '=', 'users.user_id')
            ->where('quiz_attempt_tb.quiz_id', $request->quiz_id)
            ->where('quiz_attempt_tb.user_id', $request->user_id)
            ->select(
                'quiz_attempt_tb.*',
                'users.first_name as user_name'
            )
        ->get();
        return response()->json ([
            "status" => "success",
            "data" => $quiz_attempts
        ]);
    }

    public function getStudentQuizQuestion (Request $request) {
        $student_questions = DB::table('quiz_answer_tb')
            ->join('quiz_question', 'quiz_answer_tb.quiz_question_id', '=', 'quiz_question.quiz_question_id')
            ->where('quiz_answer_tb.quiz_attempt_id', $request->quiz_attempt_id)
            // ->orderBy('quiz_answer_tb.question_order')
            ->get();
        return response()->json ([
            "status" => "success",
            "data" => $student_questions
        ]);$correctCount = $answers->filter(function ($answer) {
    return $answer->selected_option == $answer->correct_option;
})->count();

$totalQuestions = $answers->count();
$incorrectCount = $totalQuestions - $correctCount;

$percentage = $totalQuestions > 0 
    ? round(($correctCount / $totalQuestions) * 100, 2)
    : 0;
    }

    public function saveStudentQuestionAnswers (Request $request) {
        //
        $updated = DB::table('quiz_answer_tb')
            ->where('quiz_answer_id', $request->quiz_answer_id)
            ->update([
                "selected_option" => $request->selected_option
            ]);
        if (!$updated) {
            return response()->json ([
                "status" => "error",
                "message" => "Failed to update student answer"
            ], 500);
        }
        return response()->json ([
            "status" => "success",
            "message" => "Student answer updated successfully"
        ]);
    }

    public function submitQuiz (Request $request) {
        //
        $answers = DB::table('quiz_answer_tb')
            ->join('quiz_question_tb', 'quiz_answer_tb.question_id', '=', 'quiz_question_tb.question_id')
            ->where('quiz_answer_tb.quiz_attempt_id', $request->quiz_attempt_id)
            ->select(
                'quiz_answer_tb.selected_option',
                'quiz_question_tb.correct_option'
            )
        ->get();
        $correctCount = $answers->filter(function ($answer) {
            return $answer->selected_option == $answer->correct_option;
        })->count();

        $totalQuestions = $answers->count();
        $incorrectCount = $totalQuestions - $correctCount;

        $percentage = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2): 0;
        return response()->json([
            "status" => "success",
            "correct_count" => $correctCount,
            "total_questions" => $totalQuestions,
            "incorrect_count" => $incorrectCount,
            "percentage" => $percentage
        ]);
    
        }
}
