from django.urls import path
from .views import *
from . import chatbot

urlpatterns = [
    path("", portfolio, name="portfolio"),
    path("chatbot/", chatbot.chatbot, name="chatbot"), 
    path("contact/", contact, name="contact")
]