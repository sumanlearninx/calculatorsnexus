from django.core.management.base import BaseCommand
from calculators.models import SEO, Category
from .seeds.finance import seed_finance
# from .seeds.health   import seed_health     ← uncomment as you add more
# from .seeds.math     import seed_math
# from .seeds.business import seed_business


class Command(BaseCommand):
    help = 'Seeds database with all categories and calculators'

    def handle(self, *args, **kwargs):

        # ── Categories ───────────────────────────────────────────
        self.stdout.write('Seeding categories...')
        categories_data = [
            {'name': 'Finance',      'icon': '💰', 'order': 1},
            {'name': 'Health',       'icon': '❤️',  'order': 2},
            {'name': 'Math',         'icon': '📐', 'order': 3},
            {'name': 'Business',     'icon': '📊', 'order': 4},
            {'name': 'Everyday',     'icon': '📅', 'order': 5},
            {'name': 'Science',      'icon': '🔬', 'order': 6},
            {'name': 'Construction', 'icon': '🏗️', 'order': 7},
            {'name': 'Fitness',      'icon': '💪', 'order': 8},
        ]
        for data in categories_data:
            seo = SEO.objects.create(
                meta_title       = f"{data['name']} Calculators – CalculatorsNexus",
                meta_description = f"Free {data['name'].lower()} calculators.",
                robots           = 'index, follow',
                schema_type      = 'WebPage',
            )
            cat, created = Category.objects.get_or_create(
                name=data['name'],
                defaults={'icon': data['icon'], 'order': data['order'], 'seo': seo}
            )
            self.stdout.write(f"  {'Created' if created else 'Exists'}: {cat.icon} {cat.name}")

        # ── Finance Calculators ──────────────────────────────────
        self.stdout.write('\nSeeding Finance calculators...')
        results = seed_finance()
        for calc, created in results:
            self.stdout.write(f"  {'Created' if created else 'Exists'}: {calc.icon} {calc.name}")

        # ── Health Calculators ───────────────────────────────────
        # self.stdout.write('\nSeeding Health calculators...')
        # results = seed_health()

        self.stdout.write(self.style.SUCCESS('\n✅ All seed data complete!'))