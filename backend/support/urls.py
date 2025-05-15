from django.urls import path
from .views import SupportTicketCreateView

urlpatterns = [
    path('api/v1/support/tickets/', SupportTicketCreateView.as_view(), name='support-tickets'),
]