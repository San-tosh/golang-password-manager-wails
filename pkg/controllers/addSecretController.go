package controllers

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/san-tosh/golang-password-manager-wails/pkg/models"
)

type ApiError struct {
	Param   string
	Message string
}

func AddSecret() gin.HandlerFunc {
	return func(c *gin.Context) {
		var secret models.Secret
		if err := c.BindJSON(&secret); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		//validation
		validation := validationForAddSecret(secret, c)
		if validation != nil {
			return
		}

		//transaction process
		transaction := models.DB.Begin()
		value, error := models.GetUserIDByToken(c.GetHeader("token"))
		if error != nil {
			returnValidationError(c, "User ID does not exist")
			return
		}
		secret.UserID = value
		log.Println("UserID", secret.UserID)
		result := transaction.Create(&secret)
		if result.Error != nil {
			transaction.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Secrety Entry Creation Failed"})
			return
		}
		transaction.Commit()

		//return success json
		returnSuccessJSON(c, "Secret Entry Created Successfully", secret)
	}
}

func returnValidationError(c *gin.Context, error any) {
	c.JSON(http.StatusBadRequest, gin.H{
		"status":      http.StatusBadRequest,
		"description": "Validation Failed",
		"error":       error,
	})
}

func returnSuccessJSON(c *gin.Context, message string, data any) {
	c.JSON(http.StatusOK, gin.H{
		"status":      http.StatusOK,
		"description": message,
		"data":        data,
	})
}

func validationForAddSecret(model models.Secret, c *gin.Context) error {
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

	if !model.IsIdentifierUnique() {
		returnValidationError(c, "Identifier Name Already in Used.")
		return errors.New("validation failed")
	}
	return nil
}

func msgForTag(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email"
	}
	return fe.Error() // default error
}
