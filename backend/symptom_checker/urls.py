from django.urls import path
from .views import (
    SymptomListView,
    DiseaseListView,
    DiseaseDetailView,
    SymptomCheckerView,
    DO_TermListView,
    SymptomSearchView
)

urlpatterns = [
    path('api/symptoms/', SymptomListView.as_view(), name='symptom-list'),
    path('api/diseases/', DiseaseListView.as_view(), name='disease-list'),
    path('api/diseases/<int:pk>/', DiseaseDetailView.as_view(), name='disease-detail'),
    path('api/diagnose/', SymptomCheckerView.as_view(), name='symptom-checker'),
    path('api/do-terms/', DO_TermListView.as_view(), name='do-term-list'),
    path('api/symptoms/search/', SymptomSearchView.as_view(), name='symptom-search'),
]