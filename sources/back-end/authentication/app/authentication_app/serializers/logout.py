from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.settings import api_settings

######################Refresh Token ##################################
class TokenSerializer(serializers.Serializer):

    def validate(self, data):
        try:
            refresh_token = self.context["request"].COOKIES.get('r_token')
            if refresh_token is None:
                raise serializers.ValidationError({"error": "Refresh token not found in cookies"})
            token = RefreshToken(refresh_token, verify=True)
            token.check_exp()
            token.blacklist()
        except Exception as error:
            raise serializers.ValidationError({"error": str(error)})
        return data
