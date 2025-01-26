from django.shortcuts import redirect
from functools import wraps
from django.urls import reverse
from django.contrib import messages

def logout_required(view_func):
    """
    Décorateur pour rediriger les utilisateurs connectés.
    Utilisé pour des pages comme login ou register où l'utilisateur connecté ne devrait pas y accéder.
    Afficher un message a l'utilisateur.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            messages.info(request, "Vous êtes déjà connecté. Veuillez vous déconnecter pour accéder à cette page.")
            return redirect(reverse('profil:profil'))
        return view_func(request, *args, **kwargs)
    return wrapper
