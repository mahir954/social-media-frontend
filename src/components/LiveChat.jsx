import { useEffect, useRef } from "react";

function LiveChat({
  comments = [],
  commentText = "",
  setCommentText,
  onSendComment,
  currentUser = null,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const text = commentText.trim();

    if (!text) return;

    onSendComment?.(e);
  };

  return (
    <div className="live-chat-section">

      <div className="live-chat-header">
        <h3>Live Chat</h3>

        <span>
          {comments.length}
        </span>
      </div>

      <div className="live-comments">

        {comments.length === 0 ? (
          <div className="no-comments">

            <div className="no-comments-icon">
              💬
            </div>

            <p>No comments yet</p>

            <small>
              Be the first to say something!
            </small>

          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              className="live-comment"
              key={
                comment._id ||
                comment.id ||
                `${comment.userId}-${index}`
              }
            >

              <div className="comment-avatar">

                {comment.profilePic ? (
                  <img
                    src={comment.profilePic}
                    alt={
                      comment.username ||
                      "User"
                    }
                  />
                ) : (
                  <span>
                    {(
                      comment.username ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}

              </div>

              <div className="comment-content">

                <strong>
                  {comment.username ||
                    "User"}
                </strong>

                <p>
                  {comment.text}
                </p>

              </div>

            </div>
          ))
        )}

        <div ref={chatEndRef} />

      </div>

      <form
        className="live-comment-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          value={commentText}
          placeholder="Say something..."
          maxLength={300}
          onChange={(e) =>
            setCommentText?.(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={!commentText.trim()}
        >
          ➤
        </button>

      </form>

    </div>
  );
}

export default LiveChat;
