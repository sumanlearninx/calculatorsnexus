from django.db import models
from django.utils.text import slugify


class SEO(models.Model):
    meta_title          = models.CharField(max_length=200)
    meta_description    = models.CharField(max_length=300)
    meta_keywords       = models.CharField(max_length=500, blank=True)
    og_title            = models.CharField(max_length=200, blank=True)
    og_description      = models.CharField(max_length=300, blank=True)
    og_image            = models.ImageField(upload_to='seo/', blank=True, null=True, help_text='1200 x 630 pixels (landscape)')
    canonical_url       = models.URLField(blank=True)
    robots              = models.CharField(max_length=50, default='index, follow')
    schema_type         = models.CharField(max_length=50, default='SoftwareApp')
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'SEO Settings'

    def __str__(self):
        return self.meta_title


class Category(models.Model):
    name        = models.CharField(max_length=100)
    slug        = models.SlugField(unique=True, blank=True)
    icon        = models.CharField(max_length=10, default='🧮')
    icon_image  = models.ImageField(          # ← ADD THIS
                    upload_to='icons/categories/',
                    blank=True,
                    null=True,
                    help_text='Upload custom icon image (PNG, SVG, WebP). Overrides emoji icon.'
                )
    description = models.TextField(blank=True)
    order       = models.IntegerField(default=0)
    is_active   = models.BooleanField(default=True)
    seo         = models.OneToOneField(SEO, on_delete=models.SET_NULL,
                    null=True, blank=True, related_name='category')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering            = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Calculator(models.Model):
    category          = models.ForeignKey(Category, on_delete=models.CASCADE,
                          related_name='calculators')
    name              = models.CharField(max_length=200)
    slug              = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=300)
    description       = models.TextField()
    icon              = models.CharField(max_length=10, default='🧮')
    icon_image  = models.ImageField(          # ← ADD THIS
                    upload_to='icons/calculators/',
                    blank=True,
                    null=True,
                    help_text='Upload custom icon image (PNG, SVG, WebP). Overrides emoji icon.'
                )
    how_to_use        = models.TextField(blank=True)
    formula           = models.TextField(blank=True)
    example           = models.TextField(blank=True)
    is_active         = models.BooleanField(default=True)
    is_featured       = models.BooleanField(default=False)
    is_new            = models.BooleanField(default=False)
    order             = models.IntegerField(default=0)
    view_count        = models.IntegerField(default=0, editable=False)
    seo               = models.OneToOneField(SEO, on_delete=models.SET_NULL,
                          null=True, blank=True, related_name='calculator')
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.category.name} → {self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class FAQ(models.Model):
    calculator = models.ForeignKey(Calculator, on_delete=models.CASCADE,
                   related_name='faqs')
    question   = models.CharField(max_length=500)
    answer     = models.TextField()
    order      = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.calculator.name} – {self.question[:50]}"


class CalculationHistory(models.Model):
    user       = models.ForeignKey('auth.User', on_delete=models.CASCADE,
                   related_name='history')
    calculator = models.ForeignKey(Calculator, on_delete=models.CASCADE,
                   related_name='history')
    inputs     = models.JSONField()
    outputs    = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering            = ['-created_at']
        verbose_name_plural = 'Calculation Histories'

    def __str__(self):
        return f"{self.user.username} → {self.calculator.name}"


class Favorite(models.Model):
    user       = models.ForeignKey('auth.User', on_delete=models.CASCADE,
                   related_name='favorites')
    calculator = models.ForeignKey(Calculator, on_delete=models.CASCADE,
                   related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'calculator']

    def __str__(self):
        return f"{self.user.username} ❤ {self.calculator.name}"
