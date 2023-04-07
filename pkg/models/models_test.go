package models

import (
	"fmt"
	"testing"
)

func TestGetUserIDByToken(t *testing.T) {
	tokens := [3]string{
		"sdfdsf",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6InNhbnRvc2hiaHVsdW5AZ21haWwuY29tIiwiVWlkIjoiMCIsImV4cCI6MTY4MDc3OTMyN30.7ZQ89kOAhTC3O3XyauKCirZEKrLSNWR_xxXgnECGrS8",
		"sdfdsf",
	}
	for _, token := range tokens {
		_, error := GetUserByToken(token)
		if error != nil {
			t.Error("Get Userby token failed")
		}
	}
	SeedPairKeys()
}

func TestGetSecretsByUserID(t *testing.T) {
	userID := [3]uint{
		1, 2, 3,
	}
	for _, token := range userID {
		value, error := GetSecretsByUserID(token)
		if error != nil {
			t.Error("Get secrets by User token failed")
		}
		fmt.Println("data", value)
	}
}
