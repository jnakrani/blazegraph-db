from django.urls import path
from . import views

urlpatterns = [
    path("", views.ping, name="ping"),
    path("upload/", views.upload_ttl, name="upload_ttl"),
    path("namespace/", views.create_namespace, name="create_namespace"),
    path("connect_database/", views.connect_database, name="connect_database"),
    path("files/", views.get_files, name="get_files"),
    path("active-database/", views.get_active_database, name="get_active_database"),
    path("active-repository/", views.active_repository, name="get_active_repository"),
]
