from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Article, Recommendation, User
from .serializers import ArticleSerializer, RecommendationSerializer, UserSerializer
from .recommenders import HybridRecommender, ContentBasedRecommender, CollaborativeFilteringRecommender, MatrixFactorizationRecommender

class ArticleListView(generics.ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class RecommendedArticlesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ArticleSerializer

    def get_queryset(self):
        user = self.request.user
        return self._get_recommended_articles(user)

    def _get_recommended_articles(self, user):
        # Choose a recommender or use the HybridRecommender
        # recommender = ContentBasedRecommender(user)
        # recommender = CollaborativeFilteringRecommender(user)
        # recommender = MatrixFactorizationRecommender(user)
        recommender = HybridRecommender(user)
        return recommender.get_recommendations()

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
