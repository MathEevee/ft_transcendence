from django.utils.crypto import get_random_string

def csp_nonce(request):
	return {'nonce': get_random_string(32)}

def staff_status(request):
    return {
        'is_staff': request.user.is_staff if request.user.is_authenticated else False
    }
