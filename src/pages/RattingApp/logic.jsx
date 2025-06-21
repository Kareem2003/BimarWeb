import { useState, useEffect } from "react";
import { ToastManager } from "../../helpers/ToastManager";
import {
  appRate,
  getUserRating,
  updateUserRating,
} from "../../api/services/RatingServices";
import AppStorage from "../../helpers/Storage";
import { DOCTOR_INFO } from "../../helpers/constants/StaticKeys";

const useRatingLogic = (navigate) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingRating, setHasExistingRating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        let userData = localStorage.getItem(DOCTOR_INFO);
        if (!userData && localStorage.getItem(DOCTOR_INFO)) {
          userData = localStorage.getItem(DOCTOR_INFO);
        }
        if (userData) {
          const parsedData =
            typeof userData === "string" ? JSON.parse(userData) : userData;
          setUserId(parsedData._id);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        ToastManager.notify("Error fetching user information", {
          type: "error",
        });
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    getUserRating(
      (response) => {
        console.log("Response Rating : ", response);
        if (response.data && response.data.rating !== undefined) {
          const ratingData = response.data;
          setRating(ratingData.rating);
          setFeedback(ratingData.comment || "");
          setHasExistingRating(true);
        } else {
          setHasExistingRating(false);
        }
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setHasExistingRating(false);
      }
    );
  }, []);

  const getRatingEmoji = (rating) => {
    switch (rating) {
      case 1:
        return "😢";
      case 2:
        return "😕";
      case 3:
        return "😐";
      case 4:
        return "😊";
      case 5:
        return "😍";
      default:
        return "";
    }
  };

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (rating === 0) {
      ToastManager.notify("Please select a rating", { type: "error" });
      return;
    }
    if (!userId) {
      ToastManager.notify("User information not found", { type: "error" });
      return;
    }
    try {
      setIsSubmitting(true);
      const ratingService = hasExistingRating ? updateUserRating : appRate;
      ratingService(
        {
          rating: rating,
          comment: feedback,
        },
        (response) => {
          ToastManager.notify("Thank you for your feedback!", {
            type: "success",
          });
          if (navigate) navigate(-1);
        },
        (error) => {
          ToastManager.notify(error, { type: "error" });
          setIsSubmitting(false);
        }
      );
    } catch (error) {
      console.error("Exception during rating submission:", error);
      ToastManager.notify("Error submitting rating", { type: "error" });
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};

export default useRatingLogic;
