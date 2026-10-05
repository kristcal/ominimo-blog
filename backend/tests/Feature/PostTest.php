<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_post(): void
    {
        $this->postJson('/api/posts', [
            'title' => 'Test',
            'content' => 'Content',
        ])->assertUnauthorized();
    }

    public function test_authenticated_user_can_create_post(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/posts', [
            'title' => 'Test',
            'content' => 'Content',
        ])->assertCreated();

        $this->assertDatabaseHas('posts', ['title' => 'Test', 'user_id' => $user->id]);
    }

    public function test_post_requires_title_and_content(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/posts', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'content']);
    }

    public function test_owner_can_update_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated',
            'content' => 'Updated content',
        ])->assertOk();

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'title' => 'Updated']);
    }

    public function test_non_owner_cannot_update_post(): void
    {
        $post = Post::factory()->create();

        Sanctum::actingAs(User::factory()->create());

        $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Hacked',
            'content' => 'Hacked',
        ])->assertForbidden();

        $this->assertDatabaseMissing('posts', ['id' => $post->id, 'title' => 'Hacked']);
    }

    public function test_owner_can_delete_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/posts/{$post->id}")->assertNoContent();
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_non_owner_cannot_delete_post(): void
    {
        $post = Post::factory()->create();

        Sanctum::actingAs(User::factory()->create());

        $this->deleteJson("/api/posts/{$post->id}")->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }
}