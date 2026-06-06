from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView, UserReviewListView

urlpatterns = [
    path('medicine/<int:medicine_id>/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('me/', UserReviewListView.as_view(), name='user-reviews'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]
