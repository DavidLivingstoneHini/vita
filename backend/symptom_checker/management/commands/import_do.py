import pronto
from django.core.management.base import BaseCommand
from symptom_checker.models import DO_Term, DO_Relationship
import warnings


class Command(BaseCommand):
    help = 'Import Disease Ontology data'

    def handle(self, *args, **options):
        # Suppress pronto warnings
        warnings.filterwarnings("ignore", category=UserWarning)

        self.stdout.write("Loading DO from URL...")
        try:
            # Use timeout and retry for the download
            ont = pronto.Ontology(
                "https://raw.githubusercontent.com/DiseaseOntology/HumanDiseaseOntology/main/src/ontology/doid.owl",
                timeout=30
            )
            self.import_terms(ont)
            self.import_relationships(ont)
            self.stdout.write(self.style.SUCCESS("Successfully imported DO data"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to import DO: {str(e)}"))
            if hasattr(e, 'response'):
                self.stdout.write(self.style.ERROR(f"HTTP Status: {e.response.status_code}"))

    def import_terms(self, ont):
        self.stdout.write("Importing DO terms...")
        count = 0
        for term in ont.terms():
            if not term.id.startswith('DOID:'):
                continue
            try:
                DO_Term.objects.update_or_create(
                    do_id=term.id,
                    defaults={
                        'name': term.name if hasattr(term, 'name') else term.id,
                        'definition': term.definition if hasattr(term, 'definition') else '',
                        'is_obsolete': term.obsolete if hasattr(term, 'obsolete') else False
                    }
                )
                count += 1
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Failed to import term {term.id}: {str(e)}"))
                continue

        self.stdout.write(f"Imported {count} DO terms")

    def import_relationships(self, ont):
        self.stdout.write("Importing DO relationships...")
        DO_Relationship.objects.all().delete()
        count = 0

        for term in ont.terms():
            if not term.id.startswith('DOID:'):
                continue

            try:
                subj_term = DO_Term.objects.get(do_id=term.id)

                # Handle is_a relationships
                if hasattr(term, 'superclasses'):
                    for parent in term.superclasses(distance=1):
                        if not parent.id.startswith('DOID:'):
                            continue
                        try:
                            obj_term = DO_Term.objects.get(do_id=parent.id)
                            DO_Relationship.objects.get_or_create(
                                do_term=subj_term,
                                relationship_type='is_a',
                                related_do_term=obj_term
                            )
                            count += 1
                        except DO_Term.DoesNotExist:
                            continue
                        except Exception as e:
                            self.stdout.write(
                                self.style.WARNING(f"Failed to create is_a relationship for {term.id}: {str(e)}"))
                            continue

                # Handle other relationships
                if hasattr(term, 'relationships'):
                    for rel, targets in term.relationships.items():
                        try:
                            rel_name = str(rel).split('.')[-1]
                            for target in targets:
                                if not target.id.startswith('DOID:'):
                                    continue
                                try:
                                    obj_term = DO_Term.objects.get(do_id=target.id)
                                    DO_Relationship.objects.get_or_create(
                                        do_term=subj_term,
                                        relationship_type=self.normalize_relationship_type(rel_name),
                                        related_do_term=obj_term
                                    )
                                    count += 1
                                except DO_Term.DoesNotExist:
                                    continue
                                except Exception as e:
                                    self.stdout.write(self.style.WARNING(
                                        f"Failed to create {rel_name} relationship between {term.id} and {target.id}: {str(e)}"
                                    ))
                                    continue
                        except Exception as e:
                            self.stdout.write(
                                self.style.WARNING(f"Failed to process relationships for {term.id}: {str(e)}"))
                            continue

            except DO_Term.DoesNotExist:
                continue
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Failed to process term {term.id}: {str(e)}"))
                continue

        self.stdout.write(f"Imported {count} DO relationships")

    def normalize_relationship_type(self, rel_type):
        rel_type = rel_type.lower()
        if 'is_a' in rel_type:
            return 'is_a'
        elif 'part_of' in rel_type:
            return 'part_of'
        elif 'subclass' in rel_type:
            return 'subclass_of'
        elif 'has_' in rel_type:
            return rel_type.replace('has_', '')
        return rel_type