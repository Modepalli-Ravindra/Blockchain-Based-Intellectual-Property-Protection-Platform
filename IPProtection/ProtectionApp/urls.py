from django.urls import path

from . import views

urlpatterns = [path("index.html", views.index, name="index"),
	       path('UserLogin.html', views.UserLogin, name="UserLogin"), 
	       path('Register.html', views.Register, name="Register"),
	       path('RegisterAction', views.RegisterAction, name="RegisterAction"),	
	       path('UserLoginAction', views.UserLoginAction, name="UserLoginAction"),
	       path('RecordProperty', views.RecordProperty, name="RecordProperty"),
	       path('RecordPropertyAction', views.RecordPropertyAction, name="RecordPropertyAction"),
	       path('ViewProperty', views.ViewProperty, name="ViewProperty"),
	       path('Verification', views.Verification, name="Verification"),
	       path('VerificationAction', views.VerificationAction, name="VerificationAction"),
	       path('TransferAction', views.TransferAction, name="TransferAction"),
	       path('ViewRewards', views.ViewRewards, name="ViewRewards"), 	
	       path('Transfer', views.Transfer, name="Transfer"),
]
