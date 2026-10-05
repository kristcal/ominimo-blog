<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        $comment = $post->comments()->make($validated);
        $comment->user_id = $request->user()?->id;
        $comment->save();

        return response()->json($comment->load('user'), 201);
    }


    public function destroy(Comment $comment)
    {

        $this->authorize('delete', $comment);
        $comment->delete();

        return response()->noContent();
    }
}
