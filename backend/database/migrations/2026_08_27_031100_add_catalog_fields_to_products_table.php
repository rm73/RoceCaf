<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('id');
            $table->string('title')->nullable()->after('name');
            $table->text('details')->nullable()->after('description');
            $table->text('packaging')->nullable()->after('details');
            $table->string('hero_image')->nullable()->after('image');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['slug', 'title', 'details', 'packaging', 'hero_image']);
        });
    }
};
