from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Initialize the router and register the UserViewSet
router = DefaultRouter()
router.register(r'usersmodel', views.UserViewSet)

# URLConf
urlpatterns = [
    path('hello/', views.say_hello, name='hello'),
    path('index/', views.index, name='index'),  # If you have an index view
    path('create-folder-file/', views.create_folder_file, name='create_folder_file'),  # New path for creating folder and file
    path('', include(router.urls)),  # Includes the UserViewSet URLs
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('folders/',views.list_folders,name='list_folders'),
    path('folders/', views.get_user_folders, name='get_user_folders'),
]
