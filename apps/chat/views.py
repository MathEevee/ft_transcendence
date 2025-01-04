from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from .models import CustomUser, Message, Friend

@login_required
def send_message(request, recipient_id):
    if request.method == "POST":
        recipient = get_object_or_404(CustomUser, id=recipient_id)
        
        # Vérifie si les utilisateurs sont amis
        if not Friend.objects.filter(user=request.user, friend=recipient, status='accepted').exists():
            return JsonResponse({'error': 'You are not friends with this user.'}, status=403)
        
        content = request.POST.get('content')
        if not content:
            return JsonResponse({'error': 'Message content is empty.'}, status=400)
        
        # Crée le message
        message = Message.objects.create(sender=request.user, recipient=recipient, content=content)
        return JsonResponse({'status': 'Message sent', 'message_id': message.id})

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@login_required
def load_friends(request):
    friends = Friend.objects.filter(user=request.user, status='accepted')
    context = {'friends': friends}
    html = render_to_string('chat/friends_list.html', context)
    return JsonResponse({'html': html})

@login_required
def load_messages(request, recipient_id):
    recipient = get_object_or_404(CustomUser, id=recipient_id)
    
    # Récupère les messages entre les deux utilisateurs
    messages = Message.objects.filter(
        sender=request.user, recipient=recipient
    ) | Message.objects.filter(
        sender=recipient, recipient=request.user
    ).order_by('timestamp')

    context = {'messages': messages}
    html = render_to_string('chat/messages.html', context)
    return JsonResponse({'html': html})
