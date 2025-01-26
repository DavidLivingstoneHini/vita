from django.urls import path
from.views import (
    SymptomListView,
    DiseaseListView,
    DiseaseDetailView,
    SymptomDetailView,
    SymptomCheckerView,
    SymptomCheckerDisclaimerView
)

urlpatterns = [
    path('symptoms/', SymptomListView.as_view()),
    path('symptoms/<int:pk>/', SymptomDetailView.as_view()),
    path('diseases/', DiseaseListView.as_view()),
    path('diseases/<int:pk>/', DiseaseDetailView.as_view()),
    path('diagnose/', SymptomCheckerView.as_view()),
    path('diagnose/disclaimer/', SymptomCheckerDisclaimerView.as_view()),
]
