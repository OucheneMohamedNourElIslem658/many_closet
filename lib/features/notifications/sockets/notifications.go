package notifications

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/olahol/melody"

	notificationsRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/notifications/repositories"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

var Instance *NotificationsSocketManager

type NotificationsSocketManager struct {
	notificationsRepository *notificationsRepositories.NotificationsRepository

	OrdersNotificationsSocket    *melody.Melody
	ItemsNotificationsSocket     *melody.Melody
	ReviewsNotificationsSocket   *melody.Melody
}

func Init() {
	Instance = &NotificationsSocketManager{
		notificationsRepository: notificationsRepositories.NewNotificationsRepository(),
	}

	initOrdersNotificationsSocket()
	initItemsNotificationsSocket()
	initReviewsNotificationsSocket()
}

func initOrdersNotificationsSocket() {
	Instance.OrdersNotificationsSocket = melody.New()
	Instance.OrdersNotificationsSocket.HandleConnect(func(s *melody.Session) {
		auth, _ := s.Request.Context().Value("auth").(tools.Object)
		userID := uint(auth["id"].(float64))
		BroadcastToOrdersNotificationsSocket(s, userID)
	})
}

func initItemsNotificationsSocket() {
	Instance.ItemsNotificationsSocket = melody.New()
	Instance.ItemsNotificationsSocket.HandleConnect(func(s *melody.Session) {
		auth, _ := s.Request.Context().Value("auth").(tools.Object)
		userID := uint(auth["id"].(float64))
		BroadcastToItemsNotificationsSocket(s, userID)
	})
}

func initReviewsNotificationsSocket() {
	Instance.ReviewsNotificationsSocket = melody.New()
	Instance.ReviewsNotificationsSocket.HandleConnect(func(s *melody.Session) {
		auth, _ := s.Request.Context().Value("auth").(tools.Object)
		userID := uint(auth["id"].(float64))
		BroadcastToReviewsNotificationsSocket(s, userID)
	})
}

func BroadcastToOrdersNotificationsSocket(session *melody.Session, userID uint) {
	notificationsRepository := Instance.notificationsRepository
	socket := Instance.OrdersNotificationsSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		query := r.URL.Query()
		pageSizeString := query.Get("page_size")
		pageSize, err := strconv.Atoi(pageSizeString)
		if err != nil || pageSize <= 0 {
			pageSize = 10
		}

		pageString := query.Get("page")
		page, err := strconv.Atoi(pageString)
		if err != nil || page <= 0 {
			page = 1
		}

		appendMetadataString := query.Get("append_metadata")
		appendMetadata, _ := strconv.ParseBool(appendMetadataString)

		auth, _ := r.Context().Value("auth").(tools.Object)
		id := uint(auth["id"].(float64))

		if id != userID {
			return
		}

		status, result := notificationsRepository.GetOrderNotifications(
			userID,
			uint(pageSize),
			uint(page),
			appendMetadata,
		)
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "", "\t")
			s.Write(response)
		} else {
			s.Close()
		}
	}

	if session == nil {
		socket.BroadcastFilter(nil, func(s *melody.Session) bool {
			sendToSession(s)
			return false
		})
	} else {
		sendToSession(session)
	}
}

func BroadcastToItemsNotificationsSocket(session *melody.Session, userID uint) {
	notificationsRepository := Instance.notificationsRepository
	socket := Instance.ItemsNotificationsSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		query := r.URL.Query()
		pageSizeString := query.Get("page_size")
		pageSize, err := strconv.Atoi(pageSizeString)
		if err != nil || pageSize <= 0 {
			pageSize = 10
		}

		pageString := query.Get("page")
		page, err := strconv.Atoi(pageString)
		if err != nil || page <= 0 {
			page = 1
		}

		appendMetadataString := query.Get("append_metadata")
		appendMetadata, _ := strconv.ParseBool(appendMetadataString)

		auth, _ := r.Context().Value("auth").(tools.Object)
		id := uint(auth["id"].(float64))

		if id != userID {
			return
		}

		status, result := notificationsRepository.GetItemNotifications(
			userID,
			uint(pageSize),
			uint(page),
			appendMetadata,
		)
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "", "\t")
			s.Write(response)
		} else {
			s.Close()
		}
	}

	if session == nil {
		socket.BroadcastFilter(nil, func(s *melody.Session) bool {
			sendToSession(s)
			return false
		})
	} else {
		sendToSession(session)
	}
}

func BroadcastToReviewsNotificationsSocket(session *melody.Session, userID uint) {
	notificationsRepository := Instance.notificationsRepository
	socket := Instance.ReviewsNotificationsSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		query := r.URL.Query()
		pageSizeString := query.Get("page_size")
		pageSize, err := strconv.Atoi(pageSizeString)
		if err != nil || pageSize <= 0 {
			pageSize = 10
		}

		pageString := query.Get("page")
		page, err := strconv.Atoi(pageString)
		if err != nil || page <= 0 {
			page = 1
		}

		appendMetadataString := query.Get("append_metadata")
		appendMetadata, _ := strconv.ParseBool(appendMetadataString)

		auth, _ := r.Context().Value("auth").(tools.Object)
		id := uint(auth["id"].(float64))

		if id != userID {
			return
		}

		status, result := notificationsRepository.GetReviewNotifications(
			userID,
			uint(pageSize),
			uint(page),
			appendMetadata,
		)
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "", "\t")
			s.Write(response)
		} else {
			s.Close()
		}
	}

	if session == nil {
		// Broadcast to all sessions
		socket.BroadcastFilter(nil, func(s *melody.Session) bool {
			sendToSession(s)
			return false // Continue broadcasting to all sessions
		})
	} else {
		// Send to a specific session
		sendToSession(session)
	}
}