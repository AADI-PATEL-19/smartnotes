from django.shortcuts import render
from django.http import HttpResponse
from .models import User, Folder, File
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from .serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Create your views here.
def say_hello(request):
    return render(request, 'hello.html', {'name': 'jethya'})

def index(request):
    obj = User.objects.all()
    context = {
        "obj": obj,
    }
    return render(request, 'index.html', context)

# ViewSet for User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create the user and hash the password
        user = User(username=username, email=email)
        user.set_password(password)  # Ensure password is hashed
        user.save()

        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print(f"Received login data: username={username}, password={password}")

    if not username or not password:
        return Response({"error": "Both username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Attempt to authenticate
    user = authenticate(username=username, password=password)

    print(f"User authenticated: {user}")

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            "message": "Login successful",
            "user": {
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_200_OK)
    else:
        print("Authentication failed: Invalid credentials")
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_folder_file(request):
    """
    Handle the creation of a folder and a file inside that folder for a user.
    """
    logger.info(f"Request data: {request.data}")  # Add this line to log request data

    username = request.data.get('username')
    folder_name = request.data.get('folder_name')
    file_name = request.data.get('file_name')
    content = request.data.get('content')

    # Check if username and folder/file data are provided
    if not username or not folder_name or not file_name or not content:
        return Response({"error": "All fields (username, folder_name, file_name, content) are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Get the user object
        user = User.objects.get(username=username)

        # Check if the folder already exists for the user
        folder, created = Folder.objects.get_or_create(name=folder_name)

        if created:
            # If the folder was just created, associate it with the user
            user.folders.add(folder)

        # Check if the file already exists inside the folder
        if folder.files.filter(name=file_name).exists():
            return Response({"error": "File with this name already exists in the folder"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the file and associate it with the folder
        file = File.objects.create(name=file_name, content=content)
        folder.files.add(file)

        return Response({
            "message": "Folder and file created successfully",
            "folder": {"name": folder_name},
            "file": {"name": file_name, "content": content}
        }, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['GET'])
# def list_folders(request):
#     """
#     API view to return a list of all folder names.
#     """
#     folders = Folder.objects.values_list('name', flat=True)  # Get all folder names
#     return Response(folders)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_folders(request):
    try:
        # Get the username from query parameters
        username = request.query_params.get('username')
        if not username:
            return Response({"error": "Username is required as a query parameter"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch the user by username
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Get all folders for the user
        folders = user.folders.all()
        
        # Prepare folder data
        folder_data = []
        for folder in folders:
            # Get all files in each folder
            files = folder.files.all()
            file_data = [{"name": file.name, "content": file.content} for file in files]
            folder_data.append({
                "folder_name": folder.name,
                "files": file_data
            })
        
        # Prepare the response data
        response_data = {
            "username": user.username,
            "folders": folder_data
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error fetching user folders: {str(e)}")
        return Response({"error": f"Error fetching user folders: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
