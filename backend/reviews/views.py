from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Review
from medicines.models import Medicine
from .serializers import ReviewSerializer, ReviewCreateUpdateSerializer, UserReviewSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        medicine_id = self.kwargs['medicine_id']
        return Review.objects.filter(medicine_id=medicine_id)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewCreateUpdateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        medicine_id = self.kwargs['medicine_id']
        try:
            medicine = Medicine.objects.get(id=medicine_id)
        except Medicine.DoesNotExist:
            raise ValidationError("Medicine does not exist")
            
        if Review.objects.filter(user=self.request.user, medicine=medicine).exists():
            raise ValidationError("You have already reviewed this medicine")
            
        serializer.save(user=self.request.user, medicine=medicine)

class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReviewCreateUpdateSerializer

    def get_queryset(self):
        # Users can only update/delete their own reviews
        return Review.objects.filter(user=self.request.user)

class UserReviewListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).order_by('-created_at')
