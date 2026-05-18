<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CenterController extends Controller
{
    //
    public function addCenter(Request $request)
    {
        DB::table('centers_tb')->insert([
            'center_name' => $request->center_name,
            'code_name' => $request->code_name
        ]);

        return response()->json([
            "status" => "success",
            "message" => "Center added successfully"
        ]);
    }

    public function getCenters()
    {
        $centers = DB::table('centers_tb')->get();

        return response()->json([
            "status" => "success",
            "data"   => $centers
        ]);
    }
}
