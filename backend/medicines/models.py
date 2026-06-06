from django.db import models

class Medicine(models.Model):
    url = models.URLField(max_length=500, blank=True, null=True)
    name = models.CharField(max_length=255, db_index=True)
    strength = models.CharField(max_length=255, blank=True, null=True)
    generic_name = models.CharField(max_length=255, blank=True, null=True)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True, db_index=True)  # Allopathic, Herbal etc.
    dosage_form = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    unit_price = models.CharField(max_length=100, blank=True, null=True)
    strip_price = models.CharField(max_length=100, blank=True, null=True)
    pack_size_info = models.CharField(max_length=255, blank=True, null=True)
    pack_image_url = models.URLField(max_length=500, blank=True, null=True)
    indications = models.TextField(blank=True, null=True)
    side_effects = models.TextField(blank=True, null=True)
    pharmacology = models.TextField(blank=True, null=True)
    dosage_administration = models.TextField(blank=True, null=True)
    interaction = models.TextField(blank=True, null=True)
    contraindications = models.TextField(blank=True, null=True)
    pregnancy_lactation = models.TextField(blank=True, null=True)
    precautions_warnings = models.TextField(blank=True, null=True)
    special_populations = models.TextField(blank=True, null=True)
    overdose_effects = models.TextField(blank=True, null=True)
    therapeutic_class = models.TextField(blank=True, null=True)
    storage_conditions = models.TextField(blank=True, null=True)
    chemical_structure = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    reconstitution = models.TextField(blank=True, null=True)
    common_questions = models.TextField(blank=True, null=True)
    alternate_brands = models.TextField(blank=True, null=True)
    innovators_monograph = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
