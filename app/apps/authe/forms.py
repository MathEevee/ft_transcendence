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

class UserSettingsForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ['username', 'email']
        labels = {
            'username'  : 'Username',
            'email'     : 'Email',
        }
