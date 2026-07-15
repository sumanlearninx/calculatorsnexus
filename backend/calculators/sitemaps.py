from django.contrib.sitemaps import Sitemap
from django.utils import timezone
from typing import Any
from .models import Calculator, Category


class CalculatorSitemap(Sitemap):
    protocol='https'
    changefreq = 'weekly'
    priority   = 0.9

    def items(self):
        return Calculator.objects.filter(is_active=True).order_by('category', 'name')

    def location(self, obj: Any) -> str:      
        return f'/{obj.category.slug}/{obj.slug}/'

    def lastmod(self, obj: Any):
        return obj.updated_at


class CategorySitemap(Sitemap):
    protocol='https'
    changefreq = 'weekly'
    priority   = 0.7

    def items(self):
        return Category.objects.filter(is_active=True).order_by('order')

    def location(self, obj: Any) -> str:      
        return f'/{obj.slug}/'

    def lastmod(self, obj: Any):
        return obj.updated_at


class StaticPageSitemap(Sitemap):
    protocol='https'
    changefreq = 'monthly'
    priority   = 0.5

    def items(self) -> list:
        return ['/', '/search/']

    def location(self, obj: Any) -> str:      
        return obj

    def lastmod(self, obj: Any):
        return timezone.now()