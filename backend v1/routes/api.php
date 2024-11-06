<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/signin', [AuthController::class, 'signIn']);
Route::post('/signout', [AuthController::class, 'signOut']);
Route::post('/signup', [AuthController::class, 'signUp']);
