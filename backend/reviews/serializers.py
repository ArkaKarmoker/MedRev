from rest_framework import serializers
from .models import Review
from users.serializers import UserSerializer
from medicines.models import Medicine

class MedicineSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = ('id', 'name', 'generic_name', 'strength')

class UserReviewSerializer(serializers.ModelSerializer):
    medicine = MedicineSimpleSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'medicine', 'rating', 'comment', 'created_at', 'updated_at')

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'medicine', 'rating', 'comment', 'created_at', 'updated_at')
        read_only_fields = ('medicine',)

class ReviewCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('rating', 'comment')

    def to_representation(self, instance):
        # Always return the full representation (including user data) after create/update
        return ReviewSerializer(instance).data
