from django.urls import path, include
from .views import (
    ArticleListView,
    RecommendedArticlesView,
    HybridRecommendationView,
    ContentBasedRecommendationView,
    CollaborativeFilteringRecommendationView,
    MatrixFactorizationRecommendationView
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

app_name = 'content_recommender'

schema_view = get_schema_view(
    openapi.Info(
        title=f"{app_name} API",
        default_version='v1',
        description=f"API Documentation for {app_name}",
    ),
    public=True,
    permission_classes=[permissions.IsAuthenticated],
    patterns=[path('', include('content_recommender.urls'))],
)

urlpatterns = [
    path('', include([
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ])),
    path('articles/', ArticleListView.as_view()),
    path('recommended/', RecommendedArticlesView.as_view()),
    path('recommended/hybrid/', HybridRecommendationView.as_view()),
    path('recommended/content-based/', ContentBasedRecommendationView.as_view()),
    path('recommended/collaborative-filtering/', CollaborativeFilteringRecommendationView.as_view()),
    path('recommended/matrix-factorization/', MatrixFactorizationRecommendationView.as_view()),
]
