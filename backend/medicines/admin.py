from django.contrib import admin
from .models import Medicine

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('name', 'strength', 'generic_name', 'manufacturer', 'type', 'dosage_form', 'unit_price')
    search_fields = ('name', 'generic_name', 'manufacturer')
    list_filter = ('type', 'dosage_form')
    ordering = ('name',)
    # Because description fields can be huge, you can exclude them from the list view (which list_display already does).
