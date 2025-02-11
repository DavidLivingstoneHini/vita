from django.urls import path
from .views import (
    SymptomListView,
    DiseaseListView,
    DiseaseDetailView,
    SymptomDetailView,
    SymptomCheckerView,
    SymptomCheckerDisclaimerView, ConditionDetailView, SymptomSearchView
)

urlpatterns = [
    path('symptoms/', SymptomListView.as_view()),
    path('symptoms/<int:pk>/', SymptomDetailView.as_view()),
    path('diseases/', DiseaseListView.as_view()),
    path('diseases/<int:pk>/', DiseaseDetailView.as_view()),
    path('diagnose/', SymptomCheckerView.as_view()),
    path('diagnose/disclaimer/', SymptomCheckerDisclaimerView.as_view()),
    path('conditions/<int:condition_id>/', ConditionDetailView.as_view()),
    path('symptoms/search/', SymptomSearchView.as_view()),
]
