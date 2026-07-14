from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from django.views.generic import TemplateView
from calculators.sitemaps import CalculatorSitemap, CategorySitemap, StaticPageSitemap

# Register all sitemaps
sitemaps = {
    'calculators': CalculatorSitemap,
    'categories':  CategorySitemap,
    'static':      StaticPageSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('calculators.urls')),

    # Sitemap — auto updates with every new calculator
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps},
         name='django.contrib.sitemaps.views.sitemap'),

    # Robots.txt
    path('robots.txt', TemplateView.as_view(
        template_name='robots.txt',
        content_type='text/plain'
    )),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)