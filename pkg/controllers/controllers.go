package controllers

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/san-tosh/golang-password-manager-wails/pkg/models"
	generate "github.com/san-tosh/golang-password-manager-wails/pkg/tokens"
	"golang.org/x/crypto/bcrypt"
)

var Validate = validator.New()

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}
	return string(bytes)
}

func VerifyPassword(userpassword string, givenpassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(givenpassword), []byte(userpassword))
	valid := true
	msg := ""
	if err != nil {
		msg = "Login Or Passowrd is Incorerct"
		valid = false
	}
	return valid, msg
}

func SignUp() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		//validation start
		errorsMap := make(map[string]string)
		validationErr := Validate.Struct(user)
		if validationErr != nil {
			for _, err := range validationErr.(validator.ValidationErrors) {
				if err.Tag() == "email" {
					errorsMap[err.Field()] = "Invalid Email"
				}
				if err.Field() == "Passphrase" && err.Tag() == "required" {
					errorsMap[err.Field()] = "Passphrase Required"
				}
				if err.Field() == "Passphrase" && err.Tag() == "min" {
					errorsMap[err.Field()] = "Minimum 8 characters required"
				}
				if err.Field() == "Passphrase" && err.Tag() == "max" {
					errorsMap[err.Field()] = "Max 30 characters required"
				}
			}
			c.JSON(http.StatusBadRequest, gin.H{
				"status":      http.StatusBadRequest,
				"description": "Validation Failed",
				"error":       errorsMap,
			})
			return
		}
		if !user.IsEmailUnique() {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":      http.StatusBadRequest,
				"description": "Validation Failed",
				"error":       "Email already in use",
			})
			return
		}
		//validation end

		passphrase := HashPassword(user.Passphrase)
		user.Passphrase = passphrase

		token, refreshtoken, _ := generate.TokenGenerator(user.Email, strconv.FormatUint(uint64(user.ID), 10))
		user.Token = token
		user.Refresh_Token = refreshtoken
		user.CreatedAt, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.UpdatedAt, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

		//transaction process
		transaction := models.DB.Begin()
		result := transaction.Create(&user)
		if result.Error != nil {
			transaction.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "not created"})
			return
		}
		transaction.Commit()

		data := make(map[string]string)
		data["token"] = token
		data["refreshToken"] = refreshtoken

		c.JSON(http.StatusCreated, gin.H{
			"status":  http.StatusCreated,
			"message": "Successfully Signed Up",
			"data":    data,
		})
	}
}

func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var user models.User
		var founduser models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		validation := validationCheck(user, c)
		if validation != nil {
			return
		}

		userFind := models.DB.Where("email = ?", user.Email).First(&founduser)
		if userFind.Error != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":      http.StatusBadRequest,
				"description": "login or password incorrect",
			})
			return
		}

		PasswordIsValid, msg := VerifyPassword(user.Passphrase, founduser.Passphrase)
		if !PasswordIsValid {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":      http.StatusBadRequest,
				"description": msg,
			})
			return
		}
		token, refreshtoken, _ := generate.TokenGenerator(user.Email, strconv.FormatUint(uint64(user.ID), 10))
		updateUser := generate.UpdateAllTokens(token, refreshtoken, founduser.ID)
		data := make(map[string]any)
		data["email"] = updateUser.Email
		data["token"] = updateUser.Token
		data["refreshToken"] = updateUser.Refresh_Token
		c.JSON(http.StatusOK, gin.H{
			"status":      http.StatusOK,
			"description": "Logged in successfully.",
			"data":        data,
		})

	}
}

func validationCheck(model any, c *gin.Context) error {
	//validation start
	errorsMap := make(map[string]string)
	validationErr := Validate.Struct(model)
	if validationErr != nil {
		for _, err := range validationErr.(validator.ValidationErrors) {
			if err.Tag() == "email" {
				errorsMap[err.Field()] = "Invalid Email"
			}
			if err.Field() == "Passphrase" && err.Tag() == "required" {
				errorsMap[err.Field()] = "Passphrase Required"
			}
			if err.Field() == "Passphrase" && err.Tag() == "min" {
				errorsMap[err.Field()] = "Minimum 8 characters required"
			}
			if err.Field() == "Passphrase" && err.Tag() == "max" {
				errorsMap[err.Field()] = "Max 30 characters required"
			}
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"status":      http.StatusBadRequest,
			"description": "Validation Failed",
			"error":       errorsMap,
		})
		return errors.New("Validation Failed")
	}

	return nil
}
