from django.contrib import admin
from .models import SEO, Category, Calculator, FAQ, CalculationHistory, Favorite


class FAQInline(admin.StackedInline):
    model      = FAQ
    extra      = 1
    fields     = ['question', 'answer', 'order']
    ordering   = ['order']


@admin.register(SEO)
class SEOAdmin(admin.ModelAdmin):
    list_display  = ['meta_title', 'robots', 'schema_type', 'updated_at']
    search_fields = ['meta_title']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display        = ['icon', 'name', 'slug', 'order', 'is_active', 'calculator_count']
    list_display_links  = ['name']
    list_editable       = ['order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}

    @admin.display(description='# Calculators')
    def calculator_count(self, obj):
        return obj.calculators.count()

    def save_model(self, request, obj, form, change):
        if not obj.seo:
            obj.seo = SEO.objects.create(
                meta_title       = f"{obj.name} Calculators – CalculatorsNexus",
                meta_description = f"Free {obj.name.lower()} calculators.",
                robots           = 'index, follow',
                schema_type      = 'WebPage',
            )
        super().save_model(request, obj, form, change)


@admin.register(Calculator)
class CalculatorAdmin(admin.ModelAdmin):
    list_display        = ['icon', 'name', 'category', 'is_active', 'is_featured', 'is_new', 'view_count']
    list_display_links  = ['name']
    list_editable       = ['is_active', 'is_featured', 'is_new']
    prepopulated_fields = {'slug': ('name',)}
    search_fields       = ['name', 'short_description']
    list_filter         = ['category', 'is_active', 'is_featured', 'is_new']
    readonly_fields     = ['view_count']
    inlines             = [FAQInline]

    fieldsets = (
        ('Basic Info', {
            'fields': ('category', 'name', 'slug', 'icon','icon_image', 'short_description', 'description')
        }),
        ('SEO Settings', {
            'fields': ('seo',),
        }),
        ('Content', {
            'fields': ('how_to_use', 'formula', 'example'),
            'classes': ('collapse',),
        }),
        ('Display', {
            'fields': ('is_active', 'is_featured', 'is_new', 'order', 'view_count'),
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.seo:
            obj.seo = SEO.objects.create(
                meta_title       = f"{obj.name} – CalculatorsNexus",
                meta_description = obj.short_description or '',
                robots           = 'index, follow',
                schema_type      = 'SoftwareApp',
            )
        super().save_model(request, obj, form, change)


@admin.register(CalculationHistory)
class CalculationHistoryAdmin(admin.ModelAdmin):
    list_display    = ['user', 'calculator', 'created_at']
    readonly_fields = ['user', 'calculator', 'inputs', 'outputs', 'created_at']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'calculator', 'created_at']
