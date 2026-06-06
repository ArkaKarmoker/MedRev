from django.db import models
from django.conf import settings
from medicines.models import Medicine

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='reviews')
    rating = models.DecimalField(max_digits=2, decimal_places=1)  # 1.0 to 5.0
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'medicine')
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} on {self.medicine.name}"
