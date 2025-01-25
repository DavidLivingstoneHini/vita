from django.urls import path
from.views import SymptomListView, DiseaseListView, SymptomCheckerView

urlpatterns = [
    path('symptoms/', SymptomListView.as_view()),
    path('diseases/', DiseaseListView.as_view()),
    path('diagnose/', SymptomCheckerView.as_view()),
]
