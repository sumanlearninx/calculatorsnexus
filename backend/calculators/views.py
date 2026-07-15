from rest_framework.decorators import api_view, throttle_classes
from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, F
from .models import Category, Calculator
from .serializers import (
    CategoryListSerializer, CategoryDetailSerializer,
    CalculatorListSerializer, CalculatorDetailSerializer,
)


class SearchThrottle(AnonRateThrottle):
    rate = '30/hour'    # stricter limit for search endpoint


@api_view(['GET'])
def homepage_data(request):
    """Homepage data — categories, featured, new, popular"""
    categories = Category.objects.filter(is_active=True)
    featured   = Calculator.objects.filter(is_active=True, is_featured=True)[:12]
    new_calcs  = Calculator.objects.filter(is_active=True, is_new=True)[:6]
    popular    = Calculator.objects.filter(is_active=True).order_by('-view_count')[:6]

    return Response({
        'categories':           CategoryListSerializer(categories,  many=True, context={'request': request}).data,
        'featured_calculators': CalculatorListSerializer(featured,  many=True, context={'request': request}).data,
        'new_calculators':      CalculatorListSerializer(new_calcs, many=True, context={'request': request}).data,
        'popular_calculators':  CalculatorListSerializer(popular,   many=True, context={'request': request}).data,
    })


@api_view(['GET'])
def category_list(request):
    """All active categories"""
    categories = Category.objects.filter(is_active=True)
    return Response(CategoryListSerializer(categories, many=True, context={'request': request}).data)


@api_view(['GET'])
def category_detail(request, slug):
    """Single category with its calculators"""
    try:
        category = Category.objects.get(slug=slug, is_active=True)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response(CategoryDetailSerializer(category, context={'request': request}).data)


@api_view(['GET'])
def calculator_list(request):
    """All active calculators"""
    calculators = Calculator.objects.filter(is_active=True).select_related('category')
    return Response(CalculatorListSerializer(calculators, many=True, context={'request': request}).data)


@api_view(['GET'])
def calculator_detail(request, slug):
    """Single calculator with FAQs and SEO"""
    try:
        calculator = Calculator.objects.select_related(
            'category', 'seo'
        ).prefetch_related('faqs').get(slug=slug, is_active=True)
    except Calculator.DoesNotExist:
        return Response({'error': 'Calculator not found'}, status=status.HTTP_404_NOT_FOUND)

    Calculator.objects.filter(pk=calculator.pk).update(view_count=F('view_count') + 1)

    return Response(CalculatorDetailSerializer(calculator, context={'request': request}).data)


@api_view(['GET'])
@throttle_classes([SearchThrottle])
def search(request):
    """Search calculators — stricter rate limit"""
    query = request.GET.get('q', '').strip()

    if not query:
        return Response({'results': [], 'query': ''})

    # Django ORM uses parameterized queries — SQL injection protected automatically
    calculators = Calculator.objects.filter(
        is_active=True
    ).filter(
        Q(name__icontains=query) |
        Q(short_description__icontains=query) |
        Q(category__name__icontains=query)
    ).distinct().select_related('category')

    return Response({
        'query':   query,
        'count':   calculators.count(),
        'results': CalculatorListSerializer(calculators, many=True, context={'request': request}).data,
    })


@api_view(['GET'])
def related_calculators(request, slug):
    """Related calculators from same category"""
    try:
        calculator = Calculator.objects.get(slug=slug, is_active=True)
    except Calculator.DoesNotExist:
        return Response([])

    related = Calculator.objects.filter(
        category=calculator.category,
        is_active=True
    ).exclude(slug=slug).order_by('?')[:4]

    return Response(CalculatorListSerializer(related, many=True, context={'request': request}).data)
