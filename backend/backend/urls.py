from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok", "message": "MedRev API is running..."})

urlpatterns = [
    path('', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/medicines/', include('medicines.urls')),
    path('api/reviews/', include('reviews.urls')),
]
