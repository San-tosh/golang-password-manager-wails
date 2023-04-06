package models

import (
	"testing"
)

func TestGetUserIDByToken(t *testing.T) {
	tokens := [3]string{
		"sdfdsf",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6InNhbnRvc2hiaHVsdW5AZ21haWwuY29tIiwiVWlkIjoiMCIsImV4cCI6MTY4MDc3OTMyN30.7ZQ89kOAhTC3O3XyauKCirZEKrLSNWR_xxXgnECGrS8",
		"sdfdsf",
	}
	for _, token := range tokens {
		_, error := GetUserIDByToken(token)
		if error != nil {
			t.Error("Get User id by token failed")
		}
	}
}
