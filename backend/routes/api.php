<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuizController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function(){
    return "Hello, World!";
});
Route::get('/get_class', [ClassController::class, 'getAllClass']);
Route::get('/get_subjects', [SubjectController::class, 'getAllSubject']);
Route::post('/add_lesson', [LessonController::class, 'addLesson']);
Route::get('/get_all_lessons', [LessonController::class, 'getAllLesson']);
Route::post('/lesson_section', [LessonController::class, 'getLessonSection']);
Route::post('/add_student', [StudentController::class, 'addStudent']);
Route::get('/students', [StudentController::class, 'getStudents']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth_admin', [AuthController::class, 'authAdmin']);
Route::post('/create_quiz', [QuizController::class, 'createQuiz']);
Route::get('/quizzes', [QuizController::class, 'getAllQuiz']);
Route::post('/get_quiz', [QuizController::class, 'getQuiz']);
Route::post('/update_quiz', [QuizController::class, 'updateQuiz']);
Route::post('/add_question', [QuizController::class, 'addQuestion']);
Route::post('/update_question', [QuizController::class, 'updateQuestion']);
Route::post('/create_quiz_attempt', [QuizController::class, 'createQuizAttempt']);
Route::post('/get_student_quiz_attempt', [QuizController::class, 'getStudentQuizAttempt']);
Route::post('get_student_quiz_questions', [QuizController::class, 'getStudentQuizQuestion']);
Route::post('/save_student_quiz_answers', [QuizController::class, 'saveStudentQuizAnswers ']);