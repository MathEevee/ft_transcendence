from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()

class RegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        labels = {
<<<<<<< HEAD:apps/authe/forms.py
            'username'  : 'username    ',
            'email'     : 'email       ',
            'password1' : 'password    ',
            'password2' : 'confirm pass',
        }
=======
            'username': 'Username',
            'email': 'Email',
            'password1': 'Password',
            'password2': 'Confirm Password',
                }
>>>>>>> main:accounts/forms.py

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)
