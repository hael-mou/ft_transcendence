
from service_app.views.authentication import AuthenticationWithID
from service_app.components.Connection import Connection
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import json

# **************************************************************************** #
#   * Connection View :                                                        #
# **************************************************************************** #
class ConnectionView(APIView):
    authentication_classes = [AuthenticationWithID]

    def get(self, request):
        user_id = request.query_params.get('id')
        if user_id is None:
            user_id = request._user['id']

        connection = Connection.objects.filter(user_id=user_id)

        return Response(
            {
                'status': 'connected' if len(connection) > 0 else 'disconnected',
                'user_id': user_id,
                'number': len(connection)
            },
            status=status.HTTP_200_OK
        )
