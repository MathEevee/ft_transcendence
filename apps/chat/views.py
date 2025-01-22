from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser, Message, Friend, Relationship
from .serializer import RelationshipSerializer

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

class RelationshipsAPIView(APIView):
    def get(self, request, user_id):
        """
        Récupère toutes les relations pour un utilisateur donné.
        """
        relationships = Relationship.objects.filter(user_id=user_id)
        if not relationships.exists():
            return JsonResponse({'error': True, 'message': 'No relationships found.'})
        
        serializer = RelationshipSerializer(relationships, many=True)
        return Response(serializer.data)
    
    def post(self, request, user_id):
        """
        Crée une nouvelle relation pour l'utilisateur.
        """
        try:
            # Vérification des utilisateurs
            username = request.data.get('username')
            if not username:
                return JsonResponse({'error': True, 'message': 'Username is required.'})
        
            target = get_object_or_404(CustomUser, username=username)
            user = get_object_or_404(CustomUser, id=user_id)

            # Validation des données
            if target == user:
                return JsonResponse({'error': True, 'message': 'You cannot be friends with yourself.'})
            
            #todo check if user is already friend with target or blocked
            status = request.data.get('status')
            if not status:
                return JsonResponse({'error': True, 'message': 'Status is required.'})

            # Création de la relation
            if Relationship.objects.filter(user=user, target=target, relations='friend').exists():
                if (status == 'friend'):
                    return JsonResponse({'error': True, 'message': 'Already friend'})
                    
                Relationship.objects.filter(user=user, target=target).delete()
            
            relation = Relationship.objects.create(user=user, target=target, relations=status)
            serializer = RelationshipSerializer(relation)
            return Response(serializer.data)

        except Exception as e:
            return JsonResponse({'error': True, 'message': 'An unexpected error occurred.'})