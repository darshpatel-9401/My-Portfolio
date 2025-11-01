from django.contrib import admin
from .models import Project, Certificate, Resume, Contact

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'technologies', 'created_at')
    search_fields = ('title', 'description', 'technologies')
    list_filter = ('created_at',)

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'certificate_number', 'date_earned')
    search_fields = ('title', 'issuer', 'certificate_number')
    list_filter = ('date_earned',)

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('uploaded_at',)
    ordering = ('-uploaded_at',)

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    list_editable = ('is_read',)
