from django.urls import path
from .views import *

urlpatterns = [
    path("", portfolio, name="portfolio"),
    path("contact/", contact, name="contact")
]