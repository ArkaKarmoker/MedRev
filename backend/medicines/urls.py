from django.urls import path
from .views import MedicineListView, MedicineDetailView, MedicineFiltersView

urlpatterns = [
    path('', MedicineListView.as_view(), name='medicine-list'),
    path('filters/', MedicineFiltersView.as_view(), name='medicine-filters'),
    path('<int:pk>/', MedicineDetailView.as_view(), name='medicine-detail'),
]
