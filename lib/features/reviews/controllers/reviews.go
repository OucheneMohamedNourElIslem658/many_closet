package reviews

import (
	"encoding/json"
	"net/http"
	"strconv"

	reviewsRepository "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/reviews/repositories"
	"github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
)

type ReviewsController struct {
	reviewsRepository *reviewsRepository.ReviewsRepository
}

func NewReviewsController() *ReviewsController {
	return &ReviewsController{
		reviewsRepository: reviewsRepository.NewReviewsRepository(),
	}
}

func (reviewsController *ReviewsController) CreateReview(w http.ResponseWriter, r *http.Request) {
	var review models.Review
	json.NewDecoder(r.Body).Decode(&review)

	reviewsRepository := reviewsController.reviewsRepository
	status, result := reviewsRepository.CreateReview(review)

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (reviewsController *ReviewsController) UpdateReview(w http.ResponseWriter, r *http.Request) {
	var review models.Review
	json.NewDecoder(r.Body).Decode(&review)

	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}
	review.ID = uint(id)

	reviewsRepository := reviewsController.reviewsRepository
	status, result := reviewsRepository.UpdateReview(review)

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (reviewsController *ReviewsController) DeleteReview(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	reviewsRepository := reviewsController.reviewsRepository
	status, result := reviewsRepository.DeleteReview(uint(id))

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (reviewsController *ReviewsController) GetReview(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, err := strconv.Atoi(idString)
	if err != nil || id < 0 {
		id = 0
	}

	appendWith := r.URL.Query().Get("append_with")

	reviewsRepository := reviewsController.reviewsRepository
	status, result := reviewsRepository.GetReview(uint(id), appendWith)

	if status == http.StatusOK {
		review := result["review"].(models.Review)
		w.WriteHeader(status)
		response, _ := json.Marshal(&review)
		w.Write(response)
		return
	}

	w.WriteHeader(status)
	reponse, _ := json.Marshal(result)
	w.Write(reponse)
}

func (reviewsController *ReviewsController) GetReviews(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	pageSizeString := query.Get("page_size")
	pageSize, err := strconv.Atoi(pageSizeString)
	if err != nil || pageSize < 0 {
		pageSize = 0
	}

	pageString := query.Get("page")
	page, err := strconv.Atoi(pageString)
	if err != nil || page < 0 {
		page = 0
	}

	userIDString := query.Get("user_id")
	userID, err := strconv.Atoi(userIDString)
	if err != nil || userID < 0 {
		userID = 0
	}

	itemIDString := query.Get("item_id")
	itemID, err := strconv.Atoi(itemIDString)
	if err != nil || itemID < 0 {
		itemID = 0
	}

	orderBy := query.Get("order_by")
	appendWith := query.Get("append_with")

	descString := query.Get("desc")
	desc, err := strconv.ParseBool(descString)
	if err != nil {
		desc = false
	}

	reviewsRepository := reviewsController.reviewsRepository

	status, result := reviewsRepository.GetReviews(
		uint(pageSize),
		uint(page),
		appendWith,
		orderBy,
		desc,
		uint(userID),
		uint(itemID),
	)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}
