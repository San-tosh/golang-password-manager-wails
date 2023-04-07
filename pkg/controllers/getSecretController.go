package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/san-tosh/golang-password-manager-wails/pkg/helper"
	"github.com/san-tosh/golang-password-manager-wails/pkg/models"
)

func GetSecret() gin.HandlerFunc {
	return func(c *gin.Context) {
		user, error := models.GetUserByToken(c.GetHeader("token"))
		if error != nil {
			returnValidationError(c, "User ID does not exist")
			return
		}

		data, error := models.GetSecretsByUserID(user.ID)
		if error != nil {
			returnValidationError(c, error)
			return
		}
		//return success json
		returnSuccessJSON(c, "Secret entries retreived Successfully", data)
	}
}

func GetSecretForEdit() gin.HandlerFunc {
	return func(c *gin.Context) {
		identifierName := c.Query("identifierName")
		user, error := models.GetUserByToken(c.GetHeader("token"))
		if error != nil {
			returnValidationError(c, "User ID does not exist")
			return
		}

		data, error := models.GetSecretByIdentifierNameAndUserId(identifierName, user.ID)
		if error != nil {
			returnValidationError(c, error)
			return
		}
		responseData := make(map[string]any)
		responseData["id"] = data.ID
		responseData["url"] = data.URL
		responseData["identifierName"] = data.IdentifierName
		responseData["note"] = data.Note
		responseData["password"] = helper.DecryptDataWithPassword(user.Passphrase, data.Password)
		//return success json
		returnSuccessJSON(c, "Secret retreived Successfully", responseData)
	}
}
