<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    public function getLeaderboard(Request $request)
    {
        $currentUser = DB::table('users')
            ->where('user_id', $request->user_id)
            ->first();

        if (!$currentUser) {
            return response()->json([
                "status" => "error",
                "message" => "User not found"
            ], 404);
        }

        $usersQuery = DB::table('users')
            ->leftJoin('centers_tb', 'users.center_id', '=', 'centers_tb.center_id')
            ->select(
                'users.user_id',
                'users.first_name',
                'centers_tb.center_name',
                'centers_tb.code_name'
            )
            ->where('users.user_type', 1);

        if ($currentUser->user_type == 2) {

            if ($request->filled('center_id') && $request->center_id != 'all') {
                $usersQuery->where('users.center_id', $request->center_id);
            }

        } else {
            $usersQuery->where('users.center_id', $currentUser->center_id);
        }

        $users = $usersQuery->get();

        $leaderboard = $users->map(function ($user) {

            $points = DB::table('student_points_tb')
                ->where('user_id', $user->user_id)
                ->sum('points');

            $lessonsCompleted = DB::table('student_lesson_tb')
                ->where('user_id', $user->user_id)
                ->whereIn('status', [2, 3])
                ->distinct('lesson_id')
                ->count('lesson_id');

            $avgScore = DB::table('quiz_attempt_tb')
                ->where('user_id', $user->user_id)
                ->where('status', 1)
                ->avg('percentage') ?? 0;

            $badges = DB::table('student_badges_tb')
                ->where('user_id', $user->user_id)
                ->count();

            $score =
                ($points * 1) +
                ($lessonsCompleted * 5) +
                ($avgScore * 0.5) +
                ($badges * 10);

            return [
                "user_id" => $user->user_id,
                "name" => $user->first_name,
                "center_name" => $user->center_name,
                "code_name" => $user->code_name,
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