<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('analytics_reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->string('report_type');
            $table->timestamp('generated_time')->useCurrent();
            $table->text('data'); // Use JSON or text based on your preference
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('analytics_reports');
    }
};
