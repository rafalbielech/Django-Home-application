# -*- encoding: utf-8 -*-
"""
MIT License
Copyright (c) 2019 - present AppSeed.us
"""

from django.contrib import admin
from django.urls import path, include  # add this
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", include("authentication.urls")),  # add this
    path("", include("app.urls")),  # add this
    path("accounts/", include("allauth.urls")),
    path("console/admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns.extend(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
