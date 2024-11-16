from django.test import TestCase
from .models import CustomUser

class CustomUserTest(TestCase):
    def test_password_is_hashed(self):
        user = CustomUser(username="testuser", email="test@example.com")
        user.set_password("plainpassword")
        user.save()
        self.assertNotEqual(user.password, "plainpassword")
        self.assertTrue(user.password.startswith("pbkdf2_"))
