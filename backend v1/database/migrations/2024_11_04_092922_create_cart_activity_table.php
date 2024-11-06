<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cart_activity', function (Blueprint $table) {
            $table->id('cart_activity_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade'); // Foreign key to users table
            $table->foreignId('item_id')->constrained('products', "item_id")->onDelete('cascade'); // Foreign key to products table
            $table->timestamp('added_to_cart_time')->useCurrent();
            $table->boolean('checked_out')->default(false);
            $table->timestamp('checkout_time')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cart_activity');
    }
};
