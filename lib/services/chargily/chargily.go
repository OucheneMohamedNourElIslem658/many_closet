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

func CreateProduct(item *models.Item) (status int, result tools.Object) {
	requestBody := tools.Object{
		"name":        item.Name,
		"images":      item.Pics,
		"description": item.Description,
		"metadata": []models.Item{
			*item,
		},
	}
	requestBytes, _ := json.Marshal(requestBody)
	fmt.Println(string(requestBytes))
	url := Instance.BaseURL + "/products"
	secretKey := Instance.SecretKey

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(requestBytes))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
	req.Header.Add("Content-Type", "application/json")

	responseBytes, err := http.DefaultClient.Do(req)
	fmt.Println(responseBytes)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	defer responseBytes.Body.Close()
	var response tools.Object
	json.NewDecoder(responseBytes.Body).Decode(&response)

	productID := response["id"].(string)
	fmt.Println(productID)
	requestBody = tools.Object{
		"product_id": productID,
		"amount":     item.Price,
		"currency":   item.Currency,
	}
	requestBytes, _ = json.Marshal(requestBody)
	url = Instance.BaseURL + "/prices"
	secretKey = Instance.SecretKey

	req, _ = http.NewRequest("POST", url, bytes.NewBuffer(requestBytes))
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %v", secretKey))
	req.Header.Add("Content-Type", "application/json")

	responseBytes, err = http.DefaultClient.Do(req)
	if err != nil {
		return http.StatusInternalServerError, tools.Object{
			"error":   "INTERNAL_SERVER_ERROR",
			"message": err.Error(),
		}
	}
	defer responseBytes.Body.Close()
	json.NewDecoder(responseBytes.Body).Decode(&response)

	item.ChargilyPriceID = response["id"].(string)
	fmt.Println(item.ChargilyPriceID)
	return http.StatusOK, tools.Object{
		"message": "PURCHASE_ADDED",
	}
}

func CreateCheckoutURL(orderID uint, purchases []models.Purchase, successURL string) (status int, result tools.Object) {
	var items []tools.Object
	for _, purchase := range purchases {
		item := tools.Object{
			"price":    purchase.Item.ChargilyPriceID,
			"quantity": purchase.Count,
		}
		items = append(items, item)
	}
	requestBody := tools.Object{
		"items":       items,
		"success_url": successURL,
		"metadata": []tools.Object{
			{
				"order_id": orderID,
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
	var response tools.Object
	json.NewDecoder(responseBytes.Body).Decode(&response)
	fmt.Println(response["checkout_url"])
	return http.StatusOK, tools.Object{
		"checkout_url": response["checkout_url"],
	}
}
