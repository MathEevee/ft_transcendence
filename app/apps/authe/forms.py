from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()

class RegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        labels = {
            'username'  : 'Username',
            'email'     : 'Email',
            'password1' : 'Password',
            'password2' : 'Confirm Password',
        }

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)

# class UserSettingsForm(forms.ModelForm):
#     class Meta:
#         model = User
#         fields = ['username', 'email']
#         labels = {
#             'username'  : 'Username',
#             'email'     : 'Email',
#         }
#         widgets = {
#             'username'  : forms.TextInput(attrs={'class': 'form-control'}),
#             'email'  : forms.EmailInput(attrs={'class': 'form-control'}),
#         }

from django.conf import settings
import os
class UserSettingsForm(forms.ModelForm):
    # profil_picture = forms.ChoiceField(choices=[], required=False)

    class Meta:
        model = User
        fields = ['username', 'email']
        labels = {
            'username'  : 'Username',
            'email'     : 'Email',
        }

    # def __init__(self, *args, **kwargs):
    #     user= kwargs.get('instance')
    #     super().__init__(*args, **kwargs)

    #     avatars_dir = os.path.join(settings.BASE_DIR, 'static/pictures/')
    #     avatars = [f"/static/pictures/{img}" for img in os.listdir(avatars_dir) if img.endswith(('.png', '.jpg', '.jpeg'))] 
        
    #     self.fields['profil_picture'].choices = [(avatar, avatar) for avatar in avatars]

    #     if user and user.profil_picture:
    #         self.fields['profil_picture'].initial = user.profil_picture
