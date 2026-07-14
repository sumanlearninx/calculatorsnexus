from rest_framework import serializers
from .models import Category, Calculator, FAQ, SEO


class SEOSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SEO
        fields = [
            'meta_title', 'meta_description', 'meta_keywords',
            'og_title', 'og_description', 'canonical_url',
            'robots', 'schema_type'
        ]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FAQ
        fields = ['question', 'answer', 'order']


class CategoryListSerializer(serializers.ModelSerializer):
    """Used in lists — minimal data"""
    calculator_count = serializers.IntegerField(
        source='calculators.count', read_only=True
    )
    icon_image       = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ['name', 'slug', 'icon', 'icon_image', 'description', 'calculator_count']
    
    def get_icon_image(self, obj):                          
        if obj.icon_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.icon_image.url)
            return obj.icon_image.url
        return None


class CalculatorListSerializer(serializers.ModelSerializer):
    """Used in lists/cards — minimal data"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    icon_image    = serializers.SerializerMethodField()
    class Meta:
        model  = Calculator
        fields = [
            'name', 'slug', 'icon', 'icon_image', 'short_description',
            'category_name', 'category_slug',
            'is_featured', 'is_new', 'view_count'
        ]

    def get_icon_image(self, obj):                        
        if obj.icon_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.icon_image.url)
            return obj.icon_image.url
        return None


class CalculatorDetailSerializer(serializers.ModelSerializer):
    """Used in calculator detail page — full data"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    faqs          = FAQSerializer(many=True, read_only=True)
    seo           = SEOSerializer(read_only=True)
    icon_image    = serializers.SerializerMethodField()

    class Meta:
        model  = Calculator
        fields = [
            'name', 'slug', 'icon', 'icon_image',
            'short_description', 'description',
            'how_to_use', 'formula', 'example',
            'category_name', 'category_slug',
            'is_featured', 'is_new', 'view_count',
            'faqs', 'seo',
        ]

    def get_icon_image(self, obj):                       
        if obj.icon_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.icon_image.url)
            return obj.icon_image.url
        return None


class CategoryDetailSerializer(serializers.ModelSerializer):
    """Used in category page — includes calculators list"""
    calculators = CalculatorListSerializer(many=True, read_only=True)
    seo         = SEOSerializer(read_only=True)

    class Meta:
        model  = Category
        fields = ['name', 'slug', 'icon', 'description', 'calculators', 'seo']
