package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/san-tosh/golang-password-manager-wails/pkg/helper"
	"github.com/san-tosh/golang-password-manager-wails/pkg/models"
)

func EditSecret() gin.HandlerFunc {
	return func(c *gin.Context) {
		var secret models.Secret
		if err := c.BindJSON(&secret); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		user, error := models.GetUserByToken(c.GetHeader("token"))
		if error != nil {
			returnValidationError(c, "User ID does not exist")
			return
		}
		secret.UserID = user.ID
		//validation
		validation := validationForEditSecret(secret, c)
		if validation != nil {
			return
		}

		//transaction process
		secret.Password = helper.EncryptDataWithPassword(user.Passphrase, secret.Password)
		updateData := make(map[string]interface{})
		updateData["identifier_name"] = secret.IdentifierName
		updateData["note"] = secret.Note
		updateData["url"] = secret.URL
		updateData["password"] = secret.Password

		result := models.DB.Model(&models.Secret{}).Where("id = ?", secret.ID).Updates(
			&updateData)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Secrety Edit Failed"})
			return
		}
		// models.DB.Save(&secret)

		//return success json
		returnSuccessJSON(c, "Secret Entry edited Successfully", nil)
	}
}

func validationForEditSecret(model models.Secret, c *gin.Context) error {
	//validation start
	validationErr := Validate.Struct(model)
	if validationErr != nil {
		ve := validationErr.(validator.ValidationErrors)
		out := make([]ApiError, len(ve))
		for i, fe := range ve {
			out[i] = ApiError{fe.Field(), msgForTag(fe)}
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"status":      http.StatusBadRequest,
			"description": "Validation Failed",
			"error":       out,
		})
		return errors.New("validation failed")
	}

	if !model.IsIdentifierUniqueExceptId(model.ID) {
		returnValidationError(c, "Identifier Name Already in Used.")
		return errors.New("validation failed")
	}
	return nil
}
