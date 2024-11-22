from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'id_42', 'is_staff', 'is_superuser']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('id_42',)}),
    )
