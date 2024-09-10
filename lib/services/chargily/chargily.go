package chargily

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	models "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/models"
	tools "github.com/OucheneMohamedNourElIslem658/many_closet_api/lib/tools"
)

var Instance Config

func Init() {
	Instance = envs
}

// func CreateProduct(item *models.Item) (status int, result tools.Object) {
// 	requestBody := tools.Object{
// 		"name":        item.Name,
// 		"images":      item.Pics,
// 		"description": item.Description,
// 		"metadata": []models.Item{
// 			*item,
// 		},
// 	}
// 	requestBytes, _ := json.Marshal(requestBody)
// 	url := Instance.BaseURL + "/products"
// 	secretKey := Instance.SecretKey
// 	fmt.Println(string(requestBytes))
// 	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(requestBytes))
// 	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
// 	// req.Header.Add("Content-Type", "application/json")

// 	response, err := http.DefaultClient.Do(req)
// 	fmt.Println(response)
// 	if err != nil {
// 		return http.StatusInternalServerError, tools.Object{
// 			"error":   "INTERNAL_SERVER_ERROR",
// 			"message": err.Error(),
// 		}
// 	}
// 	defer response.Body.Close()
// 	var body tools.Object
// 	json.NewDecoder(response.Body).Decode(&body)

// 	if response.StatusCode != http.StatusOK {
// 		return http.StatusInternalServerError, tools.Object{
// 			"error":   "INTERNAL_SERVER_ERROR",
// 			"message": body,
// 		}
// 	}

// 	productID := result["id"].(string)
// 	requestBody = tools.Object{
// 		"product_id": productID,
// 		"amount":     item.Price,
// 		"currency":   item.Currency,
// 	}
// 	requestBytes, _ = json.Marshal(requestBody)
// 	url = Instance.BaseURL + "/prices"
// 	secretKey = Instance.SecretKey

// 	req, _ = http.NewRequest("POST", url, bytes.NewBuffer(requestBytes))
// 	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
// 	req.Header.Add("Content-Type", "application/json")

// 	response, err = http.DefaultClient.Do(req)
// 	if err != nil {
// 		fmt.Println("error in price")
// 		return http.StatusInternalServerError, tools.Object{
// 			"error":   "INTERNAL_SERVER_ERROR",
// 			"message": err.Error(),
// 		}
// 	}
// 	defer response.Body.Close()
// 	json.NewDecoder(response.Body).Decode(&body)

// 	fmt.Println(body)

// 	item.ChargilyPriceID = result["id"].(string)
// 	fmt.Println(item.ChargilyPriceID)
// 	return http.StatusOK, tools.Object{
// 		"message": "PURCHASE_ADDED",
// 	}
// }

func CreateCheckoutURL(order *models.Order, successURL string, failureURL string) (status int, result tools.Object) {
	var amount uint
	for _, purchase := range order.Purchases {
		itemPrice := purchase.Item.Price
		amount += purchase.Count * itemPrice
	}
	requestBody := tools.Object{
		"amount":      amount,
		"currency":    "dzd",
		"success_url": successURL,
		"failure_url": failureURL,
		"metadata": []tools.Object{
			{
				"order_id": order.ID,
			},
		},
	}
	requestBytes, _ := json.Marshal(requestBody)
	url := Instance.BaseURL + "/checkouts"
	secretKey := Instance.SecretKey

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(requestBytes))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
	req.Header.Add("Content-Type", "application/json")

	responseBytes, err := http.DefaultClient.Do(req)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	defer responseBytes.Body.Close()

	var body tools.Object
	json.NewDecoder(responseBytes.Body).Decode(&body)
	checkoutID := body["id"].(string)

	order.CheckoutID = &checkoutID
	order.Status = "pendingPayment"

	return http.StatusOK, tools.Object{
		"checkout_url": body["checkout_url"],
	}
}

func GetCheckout(id string) (status int, result tools.Object) {
	url := Instance.BaseURL + "/checkouts/" + id
	secretKey := Instance.SecretKey

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
	req.Header.Add("Content-Type", "application/json")

	responseBytes, err := http.DefaultClient.Do(req)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	defer responseBytes.Body.Close()
	var body tools.Object
	json.NewDecoder(responseBytes.Body).Decode(&body)

	if responseBytes.StatusCode == http.StatusOK {
		return http.StatusOK, tools.Object{
			"checkout": body,
		}
	}

	return http.StatusBadRequest, tools.Object{
		"error":   "INTERNAL_SERVER_ERROR",
		"message": body,
	}
}

func ExpireChekoutURL(id string) (status int, result tools.Object) {
	url := Instance.BaseURL + "/checkouts/" + id + "/expire"
	secretKey := Instance.SecretKey

	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
	req.Header.Add("Content-Type", "application/json")

	responseBytes, err := http.DefaultClient.Do(req)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	defer responseBytes.Body.Close()
	var body tools.Object
	json.NewDecoder(responseBytes.Body).Decode(&body)

	if responseBytes.StatusCode == http.StatusBadRequest {
		return http.StatusBadRequest, tools.Object{
			"error": "URL_HAS_ALREADY_BEEN_EXIPIRED",
		}
	}

	if responseBytes.StatusCode == http.StatusOK {
		return http.StatusOK, tools.Object{
			"message": "URL_EXPIRED",
		}
	}

	return http.StatusBadRequest, tools.Object{
		"error":   "INTERNAL_SERVER_ERROR",
		"message": body,
	}
}
