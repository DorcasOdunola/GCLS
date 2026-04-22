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

    public function getAllQuizForStudent(Request $request)
    {
        $studentId = $request->user_id;

        $quizzes = DB::table('quiz_tb')
            ->join('lesson_tb', 'lesson_tb.lesson_id', '=', 'quiz_tb.lesson_id')

            // questions count
            ->leftJoin('quiz_question', 'quiz_question.quiz_id', '=', 'quiz_tb.quiz_id')

            // lesson progress
            ->leftJoin('student_lesson_tb as sl', function ($join) use ($studentId) {
                $join->on('sl.lesson_id', '=', 'quiz_tb.lesson_id')
                    ->where('sl.user_id', '=', $studentId);
            })

            // latest attempt only
            ->leftJoin('quiz_attempt_tb as qa', function ($join) use ($studentId) {
                $join->on('qa.quiz_id', '=', 'quiz_tb.quiz_id')
                    ->where('qa.user_id', '=', $studentId)
                    ->whereRaw('qa.quiz_attempt_id = (
                        SELECT MAX(q2.quiz_attempt_id)
                        FROM quiz_attempt_tb q2
                        WHERE q2.quiz_id = quiz_tb.quiz_id
                        AND q2.user_id = '.$studentId.'
                    )');
            })

            ->select(
                'quiz_tb.quiz_id',
                'quiz_tb.quiz_title',
                'quiz_tb.lesson_id',
                'quiz_tb.created_at',
                'quiz_tb.instructions',
                'quiz_tb.duration',
                'lesson_tb.topic as lesson_topic',

                // total questions
                DB::raw('COUNT(quiz_question.quiz_question_id) as questions_count'),

                // lesson status (lock/unlock)
                DB::raw("
                    CASE 
                        WHEN sl.lesson_id IS NOT NULL AND sl.status = 3 THEN 'passed'
                        WHEN sl.lesson_id IS NOT NULL AND sl.status = 2 THEN 'completed'
                        WHEN sl.lesson_id IS NOT NULL AND sl.status = 1 THEN 'in_progress'
                        ELSE 'locked'
                    END as lesson_status
                "),

                // attempt status
                DB::raw("
                    CASE 
                        WHEN qa.status = 0 THEN 'in_progress'
                        WHEN qa.status = 1 AND qa.result_status = 'failed' THEN 'failed'
                        WHEN qa.status = 1 AND qa.result_status = 'passed' THEN 'passed'
                        ELSE 'not_started'
                    END as attempt_status
                "),

                // attempt info
                'qa.quiz_attempt_id',
                'qa.attempt_number',
                'qa.percentage'
            )

            ->groupBy(
                'quiz_tb.quiz_id',
                'quiz_tb.quiz_title',
                'quiz_tb.lesson_id',
                'quiz_tb.created_at',
                'quiz_tb.instructions',
                'quiz_tb.duration',
                'lesson_tb.topic',
                'sl.lesson_id',
                'sl.status',
                'qa.quiz_attempt_id',
                'qa.status',
                'qa.result_status',
                'qa.attempt_number',
                'qa.percentage'
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
            ->where('quiz_id', $quizId)
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

        //Count attempts for this quiz and user
        $attemptCount = DB::table('quiz_attempt_tb')
            ->where('quiz_id', $request->quiz_id)
            ->where('user_id', $request->user_id)
        ->count();

        $maxAttempts = 2; // Max attempts limit

        if ($attemptCount >= $maxAttempts) {
            return response()->json([
                "status" => "error",
                "message" => "Maximum attempts reached for this quiz"
            ], 422);
        }

        // Check if there's an existing in-progress attempt
        $existingAttempt = DB::table('quiz_attempt_tb')
            ->where('quiz_id', $request->quiz_id)
            ->where('user_id', $request->user_id)
            ->where('status', 0) // In-progress status
        ->first();
        // \Log::info('Existing attempt:', (array) $existingAttempt);
        

        if ($existingAttempt) {
            return response()->json([
                "status" => "success",
                "message" => "Existing in-progress attempt found",
                "quiz_attempt_id" => $existingAttempt->quiz_attempt_id,
                "attempt_number" => $existingAttempt->attempt_number
            ]);
        }

        // Set attempt number for the new attempt
        $attemptNumber = $attemptCount + 1;


        // Create new quiz attempt
        $quiz_attempt_id = DB::table('quiz_attempt_tb')->insertGetId([
            "percentage" => $request->percentage ?? 0,
            "status" => $request->status,
            "quiz_id" => $request->quiz_id,
            "user_id" => $request->user_id,
            "attempt_number" => $attemptNumber
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
                $inserted = DB::table('quiz_answer_tb')->insert([
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

    public function getStudentQuizAttempt(Request $request)
    {
        $quiz_attempt = DB::table('quiz_attempt_tb')
            ->join('users', 'quiz_attempt_tb.user_id', '=', 'users.user_id')
            ->where('quiz_attempt_tb.quiz_id', $request->quiz_id)
            ->where('quiz_attempt_tb.user_id', $request->user_id)
            ->orderBy('quiz_attempt_tb.attempt_number', 'desc') // KEY LINE
            ->select(
                'quiz_attempt_tb.*',
                'users.first_name as user_name'
            )
            ->first(); // get only latest

        return response()->json([
            "status" => "success",
            "data" => $quiz_attempt
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

        // $totalQuestions = $answers->count();
        // $incorrectCount = $totalQuestions - $correctCount;

        // $percentage = $totalQuestions > 0 
        //     ? round(($correctCount / $totalQuestions) * 100, 2)
        //     : 0;
    }

    public function saveStudentQuestionAnswers (Request $request) {
        //
        $updated = DB::table('quiz_answer_tb')
            ->where('quiz_answer_id', $request->quiz_answer_id)
            ->update([
                "selected_option" => $request->selected_option
            ]);
        if ($updated) {
            return response()->json ([
                "status" => "success",
                "message" => "Student answer updated successfully"
            ]);
            // return response()->json ([
            //     "status" => "error",
            //     "message" => "Failed to update student answer"
            // ], 500);
        }
    }

    public function submitQuiz (Request $request) {
        //
        $answers = DB::table('quiz_answer_tb')
            ->join('quiz_question', 'quiz_answer_tb.quiz_question_id', '=', 'quiz_question.quiz_question_id')
            ->where('quiz_answer_tb.quiz_attempt_id', $request->quiz_attempt_id)
            ->select('quiz_answer_tb.selected_option', 'quiz_question.correct_option')
            ->get();
        $correctCount = $answers->filter(function ($answer) {
            return $answer->selected_option == $answer->correct_option;
        })->count();

        $totalQuestions = $answers->count();
        $incorrectCount = $totalQuestions - $correctCount;

        $percentage = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2): 0;
        $passMark = 50;

        $result_status = $percentage >= $passMark ? 'passed' : 'failed';


        DB::table('quiz_attempt_tb')
        ->where('quiz_attempt_id', $request->quiz_attempt_id)
        ->update([
            'correct_count' => $correctCount,
            'incorrect_count' => $incorrectCount,
            'total_questions' => $totalQuestions,
            'percentage' => $percentage,
            'status' => 1, // Mark as completed
            'result_status' => $result_status,
            'submitted_at' => now()
        ]);

        $attempt = DB::table('quiz_attempt_tb')
        ->where('quiz_attempt_id', $request->quiz_attempt_id)
        ->first();

        $attemptNumber = $attempt->attempt_number ?? 1;
        if (!$attempt) {
        return response()->json([
            "status" => "error",
            "message" => "Invalid quiz attempt"
        ], 400);
}
        // Get lesson_id
        $quiz = DB::table('quiz_tb')
            ->where('quiz_id', $attempt->quiz_id)
            ->first();

        if (!$quiz) {
            return response()->json([
                "status" => "error",
                "message" => "Quiz not found"
            ], 404);
        }

        $lessonId = $quiz->lesson_id;
        $userId = $attempt->user_id;

        // Update lesson status if passed
        if ($percentage >= $passMark) {
            DB::table('student_lesson_tb')->updateOrInsert(
                [
                    'user_id' => $userId,
                    'lesson_id' => $lessonId
                ],
                [
                    'status' => 3
                ]
            );

            // Get next lesson
            $nextLesson = DB::table('lesson_tb')
                ->where('lesson_id', '>', $lessonId)
                ->orderBy('lesson_id', 'asc')
                ->first();

            // Unlock next lesson
            if ($nextLesson) {
                DB::table('student_lesson_tb')->updateOrInsert(
                    [
                        'user_id' => $userId,
                        'lesson_id' => $nextLesson->lesson_id
                    ],
                    [
                        'status' => 1 // unlocked (In-progress)
                    ]
                );
            }
        }

        $points = 0;
        $earnedBadges = [];

        if ($percentage >= 70) {
            $points = 5;
            $badge = $this->awardBadge($userId, 'High Achiever');
            if ($badge) $earnedBadges[] = $badge;
        } elseif ($percentage >= 50) {
            $points = 3;
        }

        if ($points > 0) {
            $this->addPoints($userId, $points, 'quiz');
        }


        // First quiz badge
        // 0 - in progress 1 - Completed
        $quizCount = DB::table('quiz_attempt_tb')
            ->where('user_id', $userId)
            ->where('status', 1)
            ->count();
        if ($quizCount >= 1) {
            $badge = $this->awardBadge($userId, 'Quiz Taker');
            if ($badge) $earnedBadges[] = $badge;
        }

        return response()->json([
            "status" => "success",
            "data" => [
                "correct_count" => $correctCount,
                "total_questions" => $totalQuestions,
                "incorrect_count" => $incorrectCount,
                "percentage" => $percentage,
                "attempt_number" => $attemptNumber,
                "result" => $result_status,
                "maxAttempts" => 2,
                "quiz_id" => $attempt->quiz_id,
                "badges_earned" => $earnedBadges,
                "points_earned" => $points

            ]
        ]);
            
    }

        public function addPoints($userId, $points, $type) {
        DB::table('student_points_tb')->insert([
            'user_id' => $userId,
            'points' => $points,
            'point_type' => $type,
        ]);
    }

    public function awardBadge($userId, $badgeName) {

        $badge = DB::table('badges_tb')
            ->where('name', $badgeName)
            ->first();

        if (!$badge) return null;

        $exists = DB::table('student_badges_tb')
            ->where('user_id', $userId)
            ->where('badge_id', $badge->badge_id)
            ->exists();

        if (!$exists) {
            DB::table('student_badges_tb')->insert([
                'user_id' => $userId,
                'badge_id' => $badge->badge_id,
            ]);

            return $badge; // return for UI
        }

        return null;
    }
}
