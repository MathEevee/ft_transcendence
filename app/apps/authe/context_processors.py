def staff_status(request):
	return {
		'is_staff': request.user.is_staff if request.user.is_authenticated else False
	}
