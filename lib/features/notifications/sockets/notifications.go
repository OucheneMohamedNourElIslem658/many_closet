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

	NotificationsSocket    *melody.Melody
	NotificationsStatus *melody.Melody
}

func Init() {
	Instance = &NotificationsSocketManager{
		notificationsRepository: notificationsRepositories.NewNotificationsRepository(),
	}

	initNotificationsSocket()
	initNotificationsStatusSocket()
}

func initNotificationsSocket() {
	Instance.NotificationsSocket = melody.New()
	Instance.NotificationsSocket.HandleConnect(func(s *melody.Session) {
		auth, _ := s.Request.Context().Value("auth").(tools.Object)
		userID := uint(auth["id"].(float64))
		BroadcastToNotificationsSocket(s, userID)
	})
}

func initNotificationsStatusSocket() {
	Instance.NotificationsSocket = melody.New()
	Instance.NotificationsSocket.HandleConnect(func(s *melody.Session) {
		auth, _ := s.Request.Context().Value("auth").(tools.Object)
		userID := uint(auth["id"].(float64))
		BroadcastToNotificationsStatusSocket(s, userID)
	})
}

func BroadcastToNotificationsSocket(session *melody.Session, userID uint) {
	notificationsRepository := Instance.notificationsRepository
	socket := Instance.NotificationsSocket

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

		appendWith := query.Get("append_with")

		auth, _ := r.Context().Value("auth").(tools.Object)
		id := uint(auth["id"].(float64))

		if id != userID {
			return
		}

		status, result := notificationsRepository.GetNotifications(
			userID,
			uint(pageSize),
			uint(page),
			appendWith,
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

func BroadcastToNotificationsStatusSocket(session *melody.Session, userID uint) {
	notificationsRepository := Instance.notificationsRepository
	socket := Instance.NotificationsSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		auth, _ := r.Context().Value("auth").(tools.Object)
		id := uint(auth["id"].(float64))

		if id != userID {
			return
		}

		status, result := notificationsRepository.GetSeenNotificationsCount(userID)
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