import json
import requests
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
import openai
from django.conf import settings

from api.serializers import UserSerializer
User = get_user_model()

OLLAMA_API_URL = "http://localhost:11434/api/chat"  


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that sets access and refresh tokens as HttpOnly cookies."""
    def post(self, request, *args, **kwargs):
        try:
            # Authenticate and obtain JWT tokens
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens.get('access')
            refresh_token = tokens.get('refresh')

            user = User.objects.get(username=request.data['username'])

            # Return user info + set secure cookies
            res = Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                }
            }, status=status.HTTP_200_OK)

            # Set tokens in cookies
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )
            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )

            return res

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)


class CustomTokenRefreshView(TokenRefreshView):
    """Refresh JWT tokens using HttpOnly refresh cookie."""
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response({'success': False, 'error': 'No refresh token found'}, status=400)

            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens.get('access')

            res = Response({'success': True}, status=200)
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )
            return res
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logout the user by deleting JWT cookies."""
    try:
        res = Response()
        res.data = {'success': True, 'message': 'Logged out successfully'}
        res.delete_cookie('access_token', path='/')
        res.delete_cookie('refresh_token', path='/')
        return res
    except:
        return Response({'success': False, 'message': 'Logout failed'})
    


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user."""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def chat(request):
    message = request.data.get("message")
    if not message:
        return Response({"error": "Message is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        payload = {
            "model": "llama3.2:1b",
            "messages": [
                {"role": "system", "content": "You are a female therapist helping users with their mental health problems. You answer one short sentence. Be empathetic and kind. Act casually, like you know me all your life."},
                {"role": "user", "content": message}
            ]
        }

        # Get Ollama response (streamed JSON objects)
        response = requests.post(OLLAMA_API_URL, json=payload, stream=True)

        full_reply = ""
        for line in response.iter_lines():
            if line:
                try:
                    data = json.loads(line.decode('utf-8'))
                    if "message" in data and "content" in data["message"]:
                        full_reply += data["message"]["content"]
                except json.JSONDecodeError:
                    continue  # skip malformed lines

        if not full_reply:
            return Response({"error": "Empty response from Ollama."}, status=500)

        return Response({"reply": full_reply})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
