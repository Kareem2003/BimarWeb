import React from "react";
import { useNavigate } from "react-router-dom";
import useRatingLogic from "./logic";

const starStyle = {
  fontSize: "2rem",
  cursor: "pointer",
  margin: "0 0.2rem",
};

const RateApp = () => {
  const navigate = useNavigate();
  const {
    rating,
    feedback,
    setFeedback,
    getRatingEmoji,
    getRatingLabel,
    handleStarClick,
    handleSubmit,
    isSubmitting,
    hasExistingRating,
    isLoading,
  } = useRatingLogic(navigate);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-2xl mb-2">Loading your rating...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Rate Our App</h2>
      <p className="mb-6 text-center text-gray-600">
        We value your feedback! Please rate our app and help us improve your
        experience.
      </p>
      <div className="mb-4 text-center">
        <div className="mb-2 font-semibold">Your Rating</div>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={starStyle}
              onClick={() => handleStarClick(star)}
              role="button"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              {star <= rating ? "★" : "☆"}
            </span>
          ))}
        </div>
        {rating > 0 && (
          <div className="mt-2">
            <span className="text-3xl">{getRatingEmoji(rating)}</span>
            <div className="text-lg font-medium">
              {rating} {rating === 1 ? "Star" : "Stars"}
            </div>
            <div className="text-sm text-gray-500">
              {getRatingLabel(rating)}
            </div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tell Us More</label>
        <textarea
          className="w-full border rounded p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <button
        className="w-full bg-primary hover:bg-tertiary text-white font-bold py-2 px-4 rounded disabled:opacity-60"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {hasExistingRating ? "Update Rating" : "Submit Rating"}
      </button>
    </div>
  );
};

export default RateApp;
