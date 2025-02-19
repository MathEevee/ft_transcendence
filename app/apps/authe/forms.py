from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from .utils import validate_file_extension, validate_file_size

User = get_user_model()

class RegistrationForm(UserCreationForm):
	email = forms.EmailField(max_length=255, required=True, help_text="Enter a valid email address.")

	class Meta:
		model = User
		fields = ['username', 'email', 'password1', 'password2']
		labels = {
			'username'  : 'Username',
			'email'     : 'Email',
			'password1' : 'Password',
			'password2' : 'Confirm Password',
		}
	
	def clean_email(self):
		email = self.cleaned_data.get('email')
		if len(email) > 255:
			raise forms.ValidationError("L'email ne peut pas dépasser 255 caractères.")
		return email

class LoginForm(forms.Form):
	username = forms.CharField(max_length=150, required=True)
	password = forms.CharField(widget=forms.PasswordInput, required=True)

class UserSettingsForm(forms.ModelForm):
	uploaded_picture = forms.ImageField(required=False, label="Upload new avatar", validators=[validate_file_size, validate_file_extension])

	class Meta:
		model = User
		fields = ['username', 'email', 'uploaded_picture']
		labels = {
			'username'  : 'Username',
			'email'     : 'Email',
		}
