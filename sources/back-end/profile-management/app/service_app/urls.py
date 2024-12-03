from django.urls import re_path, path
from .views.profile import Profiles, MyProfile
from .views.friends import FriendsRequestManager, AcceptFriendRequest
import service_app.views.friends as views
from .views.matches import Matches


urlpatterns = [
    re_path(r'^me$', MyProfile.as_view(), name="profile_detail"),
    re_path(r'^$', Profiles.as_view(), name="crud_profile"),

    ###########Friends 
    re_path(r'^me/friends/request/?$', FriendsRequestManager.as_view(), name="friend_request_manager"),
    re_path(r'^me/friends/accept/$', AcceptFriendRequest.as_view(), name="accept_friend"),
    re_path(r'^me/friends/reject/$', views.RejectFriendRequest.as_view(), name="reject_friend_request"),
    re_path(r'^me/friends/cancel/$', views.CancelFriendRequest.as_view(), name="cancel_friend_request"),
    re_path(r'^me/friends/delete/$', views.RemoveFriend.as_view(), name="remove_friend"),

    ##########
    re_path(r'^matches/?$', Matches.as_view(), name="matches"),
]
