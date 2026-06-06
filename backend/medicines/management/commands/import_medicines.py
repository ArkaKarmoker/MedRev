import os
import pandas as pd
from django.core.management.base import BaseCommand
from medicines.models import Medicine
from django.conf import settings

class Command(BaseCommand):
    help = 'Import medicines from CSV'

    def handle(self, *args, **kwargs):
        # The CSV file is located at the root of the project
        csv_file_path = os.path.join(settings.BASE_DIR.parent, 'all_medicine_data_[www.medex.com.bd]_06.06.2025.csv')
        
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'CSV file not found at {csv_file_path}'))
            return
            
        self.stdout.write(self.style.NOTICE(f'Reading CSV file: {csv_file_path}'))
        
        # Read the CSV file in chunks to handle memory efficiently
        chunk_size = 5000
        
        Medicine.objects.all().delete()  # Clear existing records to avoid duplicates
        self.stdout.write(self.style.NOTICE('Cleared existing Medicine records'))
        
        total_created = 0
        
        # Read with pandas and handle NaN values
        for chunk in pd.read_csv(csv_file_path, chunksize=chunk_size, dtype=str):
            chunk = chunk.fillna('') # Replace NaN with empty string
            medicines_to_create = []
            
            for index, row in chunk.iterrows():
                med = Medicine(
                    url=row.get('url', ''),
                    name=row.get('name', ''),
                    strength=row.get('strength', ''),
                    generic_name=row.get('generic_name', ''),
                    manufacturer=row.get('manufacturer', ''),
                    type=row.get('type', ''),
                    dosage_form=row.get('dosage_form', ''),
                    unit_price=row.get('unit_price', ''),
                    strip_price=row.get('strip_price', ''),
                    pack_size_info=row.get('pack_size_info', ''),
                    pack_image_url=row.get('pack_image_url', ''),
                    indications=row.get('indications', ''),
                    side_effects=row.get('side_effects', ''),
                    pharmacology=row.get('pharmacology', ''),
                    dosage_administration=row.get('dosage_administration', ''),
                    interaction=row.get('interaction', ''),
                    contraindications=row.get('contraindications', ''),
                    pregnancy_lactation=row.get('pregnancy_lactation', ''),
                    precautions_warnings=row.get('precautions_warnings', ''),
                    special_populations=row.get('special_populations', ''),
                    overdose_effects=row.get('overdose_effects', ''),
                    therapeutic_class=row.get('therapeutic_class', ''),
                    storage_conditions=row.get('storage_conditions', ''),
                    chemical_structure=row.get('chemical_structure', ''),
                    description=row.get('description', ''),
                    reconstitution=row.get('reconstitution', ''),
                    common_questions=row.get('common_questions', ''),
                    alternate_brands=row.get('alternate_brands', ''),
                    innovators_monograph=row.get('innovators_monograph', '')
                )
                medicines_to_create.append(med)
            
            Medicine.objects.bulk_create(medicines_to_create)
            total_created += len(medicines_to_create)
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {total_created} records...'))
            
        self.stdout.write(self.style.SUCCESS(f'Finished importing. Total records: {total_created}'))
