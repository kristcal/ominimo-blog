<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_add_comment(): void
    {
        $post = Post::factory()->create();

        $this->postJson("/api/posts/{$post->id}/comments", [
            'comment' => 'Nice post',
        ])->assertCreated();

        $this->assertDatabaseHas('comments', [
            'post_id' => $post->id,
            'comment' => 'Nice post',
            'user_id' => null,
        ]);
    }

    public function test_authenticated_user_can_add_comment(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson("/api/posts/{$post->id}/comments", [
            'comment' => 'Nice post',
        ])->assertCreated();

        $this->assertDatabaseHas('comments', [
            'post_id' => $post->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_comment_author_can_delete_comment(): void
    {
        $user = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/comments/{$comment->id}")->assertNoContent();
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_post_owner_can_delete_comment(): void
    {
        $postOwner = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $postOwner->id]);
        $comment = Comment::factory()->create(['post_id' => $post->id]);

        Sanctum::actingAs($postOwner);

        $this->deleteJson("/api/comments/{$comment->id}")->assertNoContent();
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_unrelated_user_cannot_delete_comment(): void
    {
        $comment = Comment::factory()->create();

        Sanctum::actingAs(User::factory()->create());

        $this->deleteJson("/api/comments/{$comment->id}")->assertForbidden();
        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }

    public function test_guest_cannot_delete_comment(): void
    {
        $comment = Comment::factory()->create();

        $this->deleteJson("/api/comments/{$comment->id}")->assertUnauthorized();
    }
}