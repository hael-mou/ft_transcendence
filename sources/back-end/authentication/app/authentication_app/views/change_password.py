from rest_framework import status
from rest_framework.response import Response 
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from authentication_app.serializers.change_password import ChangePasswordSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from authentication_app.models import CustomUser
  
class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer
 
    def patch(self, request):
        print(request.user) 
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
