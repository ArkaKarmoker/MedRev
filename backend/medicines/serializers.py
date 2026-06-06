from rest_framework import serializers
from .models import Medicine

class MedicineListSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Medicine
        fields = ('id', 'name', 'strength', 'generic_name', 'manufacturer', 'type', 'dosage_form', 'unit_price', 'pack_image_url', 'average_rating', 'review_count')

class MedicineDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'
