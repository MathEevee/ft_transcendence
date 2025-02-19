import os
from django.utils.text import slugify
from django.core.exceptions import ValidationError

def get_safe_filename(uploaded_file, max_length=255, folder="avatars/"):
	"""
	Tronque le nom du fichier pour éviter les erreurs de longueur.
	"""
	max_name_length = max_length - len(folder) - len(os.path.splitext(uploaded_file.name)[1]) - 1  # 1 pour "/"
	name, ext = os.path.splitext(uploaded_file.name)
	short_name = slugify(name)[:max_name_length]
	return f"{folder}{short_name}{ext}"

def validate_max_length(value, max_length=255):
	if len(value) > max_length:
		raise ValidationError(f"Ce champ ne peut pas dépasser {max_length} caractères.")

def validate_file_size(image):
	max_size = 2 * 1024 * 1024  # 2MB
	if image.size > max_size:
		raise ValidationError(f"Le fichier est trop volumineux (max {max_size / (1024 * 1024)} MB)")

def validate_file_extension(image):
	valid_extensions = ['jpg', 'jpeg', 'png', 'gif']
	ext = image.name.split('.')[-1].lower()
	if ext not in valid_extensions:
		raise ValidationError("Seuls les formats JPG, JPEG, PNG et GIF sont autorisés.")
