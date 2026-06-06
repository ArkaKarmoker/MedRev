from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'gender', 'phone_number', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Profile Info', {'fields': ('gender', 'phone_number')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
