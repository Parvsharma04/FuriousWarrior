<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
  // public function signIn(Request $request)
  // {
  //   $credentials = $request->validate([
  //     'email' => 'required|email',
  //     'password' => 'required'
  //   ]);

  //   if (Auth::attempt($credentials)) {
  //     $request->session()->regenerate();
  //     return response()->json(['message' => 'Signed in successfully'], 200);
  //   }

  //   return response()->json(['error' => 'Invalid credentials'], 401);
  // }


  public function signIn(Request $request)
  {
    $email = $request->input('email');
    $password = $request->input('password');
    // Add logic for handling the sign-in process
    return response()->json(['message' => 'Sign-in successful']);
  }

  public function signOut(Request $request)
  {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Signed out successfully'], 200);
  }

  public function signUp(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users',
      'password' => 'required|confirmed|min:8',
    ]);

    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => bcrypt($request->password),
    ]);

    Auth::login($user);
    return response()->json(['message' => 'Account created successfully'], 201);
  }
}
