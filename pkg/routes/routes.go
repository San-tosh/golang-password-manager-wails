package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/san-tosh/golang-password-manager-wails/pkg/controllers"
	"github.com/san-tosh/golang-password-manager-wails/pkg/middleware"
)

func UserRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/user/signup", controllers.SignUp())
	incomingRoutes.POST("/user/sigin", controllers.Login())
}

func AdminRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.Use(middleware.Authentication())
	incomingRoutes.POST("/admin/add-secret", controllers.AddSecret())
	incomingRoutes.GET("/admin/get-secret", controllers.GetSecret())
	incomingRoutes.POST("/admin/edit-secret", controllers.EditSecret())
	incomingRoutes.POST("/admin/delete-secret", controllers.DeleteSecret())
	incomingRoutes.GET("/admin/get-secret-for-edit", controllers.GetSecretForEdit())
}
