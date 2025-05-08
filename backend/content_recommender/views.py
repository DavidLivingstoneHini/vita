from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated
from .models import Article, Recommendation, User
from .serializers import ArticleSerializer, RecommendationSerializer, UserSerializer
from .recommenders import HybridRecommender, ContentBasedRecommender, CollaborativeFilteringRecommender, MatrixFactorizationRecommender
from rest_framework.response import Response
import logging
from django.db.models import Q

logger = logging.getLogger(__name__)

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, context={'request': request})  # Add context here
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        except Exception as e:
            logger.error(f"Error fetching article: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to fetch article'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RecommendedArticlesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer

    def get_queryset(self):
        try:
            user = self.request.user
            recommender = HybridRecommender(user)
            return recommender.get_recommendations()
        except Exception as e:
            logger.error(f"Recommendation error: {str(e)}")
            return Article.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'status': 'success',
                'count': len(serializer.data),
                'data': serializer.data
            })
        except Exception as e:
            logger.error(f"Error listing recommendations: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to get recommendations'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HybridRecommendationView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer

    def get_queryset(self):
        user = self.request.user
        hybrid_recommender = HybridRecommender(user)
        return hybrid_recommender.get_recommendations()

class ContentBasedRecommendationView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer

    def get_queryset(self):
        user = self.request.user
        cbf_recommender = ContentBasedRecommender(user)
        return cbf_recommender.get_recommendations()

class CollaborativeFilteringRecommendationView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer

    def get_queryset(self):
        user = self.request.user
        cf_recommender = CollaborativeFilteringRecommender(user)
        return cf_recommender.get_recommendations()

class MatrixFactorizationRecommendationView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer

    def get_queryset(self):
        user = self.request.user
        mf_recommender = MatrixFactorizationRecommender(user)
        return mf_recommender.get_recommendations()

class ArticleSearchView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content', 'summary']

    def get_queryset(self):
        search_query = self.request.query_params.get('search', '')
        if search_query:
            return Article.objects.filter(
                Q(title__icontains=search_query) |
                Q(content__icontains=search_query) |
                Q(summary__icontains=search_query)
            )
        return Article.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'status': 'success',
                'count': len(serializer.data),
                'data': serializer.data
            })
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Failed to perform search'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
