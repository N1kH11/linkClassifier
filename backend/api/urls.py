from django.urls import path
from . import views

urlpatterns = [
    path('preview/', views.preview_link, name='preview_link'),
]
