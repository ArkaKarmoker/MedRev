from rest_framework.throttling import UserRateThrottle

class AdminExemptUserRateThrottle(UserRateThrottle):
    def allow_request(self, request, view):
        # Admin users have no rate limit
        if request.user and request.user.is_superuser:
            return True
        return super().allow_request(request, view)
