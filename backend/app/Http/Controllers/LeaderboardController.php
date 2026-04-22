<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    //
    public function getLeaderboard()
    {
        $users = DB::table('users')
            ->select('user_id', 'first_name')
            ->get();

        $leaderboard = $users->map(function ($user) {

            $points = DB::table('student_points_tb')
                ->where('user_id', $user->user_id)
                ->sum('points');

            $lessonsCompleted = DB::table('student_lesson_tb')
                ->where('user_id', $user->user_id)
                ->where('status', 2)
                ->distinct('lesson_id')
                ->count('lesson_id');

            $avgScore = DB::table('quiz_attempt_tb')
                ->where('user_id', $user->user_id)
                ->where('status', 1)
                ->avg('percentage') ?? 0;

            $badges = DB::table('student_badges_tb')
                ->where('user_id', $user->user_id)
                ->count();

            //  Final score formula
            $score =
                ($points * 1) +
                ($lessonsCompleted * 5) +
                ($avgScore * 0.5) +
                ($badges * 10);

            return [
                "user_id" => $user->user_id,
                "name" => $user->first_name,
                "points" => $points,
                "lessons_completed" => $lessonsCompleted,
                "avg_quiz_score" => round($avgScore, 2),
                "badges" => $badges,
                "score" => round($score, 2)
            ];
        })
        ->sortByDesc('score')
        ->values();

        return response()->json([
            "status" => "success",
            "data" => $leaderboard
        ]);
    }
}

