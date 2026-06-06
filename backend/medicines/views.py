from rest_framework import generics, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Medicine
from .serializers import MedicineListSerializer, MedicineDetailSerializer

class MedicineFiltersView(APIView):
    def get(self, request):
        types = Medicine.objects.exclude(type__isnull=True).exclude(type__exact='').values_list('type', flat=True).distinct()
        dosage_forms = Medicine.objects.exclude(dosage_form__isnull=True).exclude(dosage_form__exact='').values_list('dosage_form', flat=True).distinct()
        return Response({
            'types': sorted(list(types)),
            'dosage_forms': sorted(list(dosage_forms))
        })

from django.db.models import Avg, Count

from .pagination import StandardResultsSetPagination

class MedicineListView(generics.ListAPIView):
    queryset = Medicine.objects.annotate(
        average_rating=Avg('reviews__rating'),
        review_count=Count('reviews')
    ).order_by('name')
    serializer_class = MedicineListSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'dosage_form']
    search_fields = ['name', 'generic_name']
    ordering_fields = ['name', 'strength', 'generic_name', 'manufacturer', 'type', 'dosage_form', 'unit_price', 'average_rating']

class MedicineDetailView(generics.RetrieveAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineDetailSerializer
