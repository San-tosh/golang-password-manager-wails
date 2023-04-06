package models

import (
	"errors"
	"log"
	"time"

	"github.com/san-tosh/golang-password-manager-wails/pkg/config"
	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	ID            uint   `gorm:"primaryKey"`
	Email         string `json:"email" validate:"email,required"`
	Passphrase    string `json:"passphrase" validate:"required,min=8,max=30"`
	Token         string `json:"token"`
	Refresh_Token string `json:"refresh_token"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type Secret struct {
	ID             uint `gorm:"primaryKey"`
	UserID         uint
	IdentifierName string `json:"identifierName" validate:"required,min=8,max=30"`
	Password       string `json:"password" validate:"required,min=8,max=330"`
	URL            string `json:"url" validate:"required,url"`
	Note           string `json:"note" validate:"required,min=8,max=200"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func init() {
	config.Connect()
	DB = config.GetDB()
	DB.AutoMigrate(&User{}, &Secret{})
}

func (u *User) CreateUser() *User {
	DB.Create(&u)
	return u
}

func (u *User) IsEmailUnique() bool {
	var count int64
	DB.Model(&User{}).Where("email = ?", u.Email).Count(&count)
	return count <= 0
}

func (u *Secret) IsIdentifierUnique() bool {
	var count int64
	DB.Model(&Secret{}).Where("identifier_name = ?", u.IdentifierName).Count(&count)
	return count <= 0
}

func GetUserIDByToken(token string) (uint, error) {
	var id any
	log.Println(token)
	result := DB.Raw("Select id FROM users where token = ?", token).Scan(&id)
	if result.Error != nil {
		return 0, errors.New("get user id by token query failed")
	}
	log.Println("userid", &result)
	return 1, nil
}
