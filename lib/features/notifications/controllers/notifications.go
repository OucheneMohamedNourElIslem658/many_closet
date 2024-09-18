package notifications

import (
	"encoding/json"
	"net/http"
	"strconv"

	notificationsRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/notifications/repositories"
	notificationsSockets "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/notifications/sockets"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

type NotificationsController struct {
	notificationsRepository *notificationsRepositories.NotificationsRepository
}

func NewNotificationsController() *NotificationsController {
	notificationsSockets.Init()
	return &NotificationsController{
		notificationsRepository: notificationsRepositories.NewNotificationsRepository(),
	}
}

func (notificationsController *NotificationsController) GetOrderNotifications(w http.ResponseWriter, r *http.Request) {
	notificationsSockets.Instance.OrdersNotificationsSocket.HandleRequest(w, r)
}

func (notificationsController *NotificationsController) GetItemNotifications(w http.ResponseWriter, r *http.Request) {
	notificationsSockets.Instance.ItemsNotificationsSocket.HandleRequest(w, r)
}

func (notificationsController *NotificationsController) GetReviewNotifications(w http.ResponseWriter, r *http.Request) {
	notificationsSockets.Instance.ReviewsNotificationsSocket.HandleRequest(w, r)
}

func (notificationsController *NotificationsController) UpdateNotification(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, _ := strconv.Atoi(idString)

	var body struct {
		Seen *bool `json:"seen"`
	}
	json.NewDecoder(r.Body).Decode(&body)

	auth, _ := r.Context().Value("auth").(tools.Object)
	userID := uint(auth["id"].(float64))

	status, result := notificationsController.notificationsRepository.UpdateNotification(uint(id), userID, body.Seen)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}

func (notificationsController *NotificationsController) DeleteNotification(w http.ResponseWriter, r *http.Request) {
	idString := r.PathValue("id")
	id, _ := strconv.Atoi(idString)

	auth, _ := r.Context().Value("auth").(tools.Object)
	userID := uint(auth["id"].(float64))

	status, result := notificationsController.notificationsRepository.DeleteNotification(uint(id), userID)

	w.WriteHeader(status)
	response, _ := json.Marshal(result)
	w.Write(response)
}
