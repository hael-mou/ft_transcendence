from django.urls import path
from service_app.views.tournament import Tournaments, CreateNewTournament, LeaveTournament, JoinTournament, MyTournament
from service_app.views.matches import MatchResult 

urlpatterns = [
    path("", Tournaments.as_view(), name="list-tournaments"),
    path("create", CreateNewTournament.as_view(), name="create-tournament"),
    path("leave", LeaveTournament.as_view(), name="leave-tournament"),
    path("join", JoinTournament.as_view(), name="join-tournament"),
    path("results", MatchResult.as_view(), name="results"),
    path("me", MyTournament.as_view(), name="my-tournament"),
]