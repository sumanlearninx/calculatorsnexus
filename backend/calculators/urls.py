from django.urls import path
from . import views

urlpatterns = [
    # Homepage data
    path('',views.homepage_data,name='homepage_data'),

    # Categories
    path('categories/',views.category_list,name='category_list'),
    path('categories/<slug:slug>/',views.category_detail,name='category_detail'),
    path('calculators/<slug:slug>/related/', views.related_calculators, name='related'),

    # Calculators
    path('calculators/',views.calculator_list,  name='calculator_list'),
    path('calculators/<slug:slug>/',views.calculator_detail,name='calculator_detail'),

    # Search
    path('search/',views.search,name='search'),
]
