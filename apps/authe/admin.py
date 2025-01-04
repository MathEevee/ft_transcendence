from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'intra_id', 'is_staff', 'is_superuser', 'is_online', 'last_login','profil_picture']
    list_filter = ['is_staff', 'is_superuser']
    search_fields = ['username', 'email']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('intra_id', 'profil_picture')}),
    )
