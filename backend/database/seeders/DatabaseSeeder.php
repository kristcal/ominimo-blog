<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory(5)->create()->each(function (User $user) {
            Post::factory(3)->create(['user_id' => $user->id])->each(function (Post $post) {
                Comment::factory(2)->create(['post_id' => $post->id]);
            });
        });

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
        ]);
        $admin->role = 'admin';
        $admin->save();

    }

}
