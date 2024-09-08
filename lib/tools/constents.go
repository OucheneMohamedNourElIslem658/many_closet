package tools

import "strings"

type Object map[string]interface{}

func GetValidExtentions(initialValues string, validValues ...string) []string {
	extentions := strings.Split(initialValues, ",")
	validExtentions := make([]string, 0)
	for _, extention := range extentions {
		extention = strings.ToLower(extention)
		isExtentionValid := contains(validValues, extention)
		if isExtentionValid {
			extention = strings.ToUpper(string(extention[0])) + extention[1:]
			validExtentions = append(validExtentions, extention)
		}
	}
	return validExtentions
}

func GetValidFilters(initialValues string, validValues ...string) []string {
	filter := strings.Split(initialValues, ",")
	validFilters := make([]string, 0)
	for _, filter := range filter {
		filter = strings.ToLower(filter)
		isFilterValid := contains(validValues, filter)
		if isFilterValid {
			if filter == "creation_time" {
				filter = "created_at"
			}
			validFilters = append(validFilters, filter)
		}
	}
	return validFilters
}

func contains(slice []string, value string) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}
