package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/san-tosh/golang-password-manager-wails/pkg/models"
)

type DeleteSecretStruct struct {
	IdentifierName string `json:"identifierName" validate:"required,min=8,max=30"`
}

func DeleteSecret() gin.HandlerFunc {
	return func(c *gin.Context) {
		var deleteSecretStruct DeleteSecretStruct
		if err := c.BindJSON(&deleteSecretStruct); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		identifierName := deleteSecretStruct.IdentifierName
		//validation
		validation := validationForDeleteSecret(deleteSecretStruct, c)
		if validation != nil {
			return
		}

		secret, error := models.GetSecretByIdentifierName(identifierName)
		if error != nil {
			returnValidationError(c, "Identifier Name not found")
			return
		}

		//transaction process
		transaction := models.DB.Begin()
		result := transaction.Delete(&secret)
		if result.Error != nil {
			transaction.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Secrety DeletionFailed"})
			return
		}
		transaction.Commit()

		//return success json
		returnSuccessJSON(c, "Secret Deleted Successfully", nil)
	}
}

func validationForDeleteSecret(model DeleteSecretStruct, c *gin.Context) error {
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

	return nil
}
