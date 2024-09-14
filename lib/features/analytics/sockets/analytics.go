package analytics

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/olahol/melody"

	analyticsRepositories "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/features/analytics/repositories"
)

var Instance *AnalyticsSocketManager

type AnalyticsSocketManager struct {
	analyticsRepository *analyticsRepositories.AnalyticsRepository

	TotalProductsSocket        *melody.Melody
	ProductsBySalesSocket      *melody.Melody
	TotalOrdersSocket          *melody.Melody
	OrdersByStatusSocket       *melody.Melody
	OrderTrendsSocket          *melody.Melody
	TotalRevenueSocket         *melody.Melody
	TotalRegisteredUsersSocket *melody.Melody
	NewUsersSocket             *melody.Melody
	ActiveUsersSocket          *melody.Melody
	MostReviewedProductsSocket *melody.Melody
}

func Init() {
	Instance = &AnalyticsSocketManager{
		analyticsRepository: analyticsRepositories.NewAnalyticsRepository(),
	}

	initTotalProductsSocket()
	initProductsBySalesSocket()
	initTotalOrdersSocket()
	initOrdersByStatusSocket()
	initOrderTrendsSocket()
	initTotalRevenueSocket()
	initTotalRegisteredUsersSocket()
	initNewUsersSocket()
	initActiveUsersSocket()
}

func initTotalProductsSocket() {
	Instance.TotalProductsSocket = melody.New()
	Instance.TotalProductsSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToTotalProductsSocket(s)
	})
}

func initProductsBySalesSocket() {
	Instance.ProductsBySalesSocket = melody.New()
	Instance.ProductsBySalesSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToProductsBySalesSocket(s)
	})
}

func initTotalOrdersSocket() {
	Instance.TotalOrdersSocket = melody.New()
	Instance.TotalOrdersSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToTotalOrdersSocket(s)
	})
}

func initOrdersByStatusSocket() {
	Instance.OrdersByStatusSocket = melody.New()
	Instance.OrdersByStatusSocket.HandleConnect(func(s *melody.Session) {
	   BroadcastToOrdersByStatusSocket(s)
	})
}

func initOrderTrendsSocket() {
	Instance.OrderTrendsSocket = melody.New()
	Instance.OrderTrendsSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToOrderTrendsSocket(s)
	})
}

func initTotalRevenueSocket() {
	Instance.TotalRevenueSocket = melody.New()
	Instance.TotalRevenueSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToTotalRevenueSocket(s)
	})
}

func initTotalRegisteredUsersSocket() {
	Instance.TotalRegisteredUsersSocket = melody.New()
	Instance.TotalRegisteredUsersSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToTotalRegisteredUsersSocket(s)
	})
}

func initNewUsersSocket() {
	Instance.NewUsersSocket = melody.New()
	Instance.NewUsersSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToNewUsersSocket(s)
	})
}

func initActiveUsersSocket() {
	Instance.ActiveUsersSocket = melody.New()
	Instance.ActiveUsersSocket.HandleConnect(func(s *melody.Session) {
		BroadcastToActiveUsersSocket(s)
	})
}

// Broadcast to sockets:

func BroadcastToTotalProductsSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.TotalProductsSocket

	sendToSession := func(s *melody.Session) {
		status, result := analyticsRepository.TotalProducts()
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToProductsBySalesSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.ProductsBySalesSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		query := r.URL.Query()

		count, _ := strconv.Atoi(query.Get("count"))
		asc, _ := strconv.ParseBool(query.Get("asc"))

		status, result := analyticsRepository.ProductsBySales(uint(count), asc)
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToTotalOrdersSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.TotalOrdersSocket

	sendToSession := func(s *melody.Session) {
		status, result := analyticsRepository.TotalOrders()
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToOrdersByStatusSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.OrdersByStatusSocket

	sendToSession := func(s *melody.Session) {
		status, result := analyticsRepository.OrdersByStatus()
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToOrderTrendsSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.OrderTrendsSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		query := r.URL.Query()

		period := query.Get("period")
		if period == "" {
			period = "daily"
		}

		status, result := analyticsRepository.OrderTrends(period)
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToTotalRevenueSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.TotalRevenueSocket

	sendToSession := func(s *melody.Session) {
		status, result := analyticsRepository.TotalRevenue()
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToTotalRegisteredUsersSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.TotalRegisteredUsersSocket

	sendToSession := func(s *melody.Session) {
		status, result := analyticsRepository.TotalRegisteredUsers()
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToNewUsersSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.NewUsersSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		query := r.URL.Query()

		period := query.Get("period")
		if period == "" {
			period = "weekly"
		}

		status, result := analyticsRepository.NewUsers(period)
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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

func BroadcastToActiveUsersSocket(session *melody.Session) {
	analyticsRepository := Instance.analyticsRepository
	socket := Instance.ActiveUsersSocket

	sendToSession := func(s *melody.Session) {
		r := s.Request
		query := r.URL.Query()

		totalDaysStr := query.Get("totalDays")
		totalDays, err := strconv.Atoi(totalDaysStr)
		if err != nil {
			totalDays = 30
		}

		countStr := query.Get("count")
		count, err := strconv.Atoi(countStr)
		if err != nil {
			count = 100
		}

		status, result := analyticsRepository.ActiveUsers(totalDays, uint(count))
		if status == http.StatusOK {
			response, _ := json.MarshalIndent(result, "","\t")
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