from typing import List

from .models import User, Article
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd

class Recommender:
    def __init__(self, user):
        self.user = user

class ContentBasedRecommender(Recommender):
    def _generate_embeddings(self, articles):
        # Use a library like spaCy or transformers to generate embeddings
        # For simplicity, let's assume a basic TF-IDF vectorizer
        vectorizer = TfidfVectorizer()
        embeddings = vectorizer.fit_transform([article.content for article in articles])
        return embeddings

    def get_recommendations(self):
        try:
            articles = Article.objects.all()
            embeddings = self._generate_embeddings(articles)
            user_interactions = self.user.interactions.values('article')
            interacted_articles = [article['article'] for article in user_interactions]

            # Calculate similarities between interacted articles and all articles
            similarities = cosine_similarity(embeddings[interacted_articles], embeddings).mean(axis=0)

            # Get top N recommended articles based on similarities
            N = 10
            recommended_articles = np.argsort(-similarities)[:N]
            recommended_articles = [int(i) for i in recommended_articles]  # Convert to int

            # Efficiently retrieve recommended articles
            return Article.objects.filter(id__in=recommended_articles)
        except Exception as e:
            print(f"Error generating content-based recommendations: {e}")
            # Return a fallback set of recommendations or an error message
            return Article.objects.all()[:10]  # Fallback

class CollaborativeFilteringRecommender(Recommender):
    def get_recommendations(self) -> List[Article]:
        try:
            # Simple user-based collaborative filtering
            similar_users = User.objects.filter(
                recommendation__article__in=self.user.recommendation.all().values('article')
            ).exclude(id=self.user.id).distinct()[:10]

            recommended_articles = Article.objects.filter(
                recommendation__user__in=similar_users
            ).exclude(
                id__in=self.user.recommendation.all().values('article')
            )

            return recommended_articles
        except Exception as e:
            print(f"Error generating collaborative filtering recommendations: {e}")
            # Return a fallback set of recommendations or an error message
            return Article.objects.all()[:10]  # Fallback

class MatrixFactorizationRecommender(Recommender):
    def __init__(self, user):
        super().__init__(user)
        self.num_users = len(User.objects.all())
        self.num_articles = len(Article.objects.all())
        self.embedding_dim = 128
        self.model = self._initialize_model()

    def _initialize_model(self):
        class MatrixFactorization(nn.Module):
            def __init__(self, num_users, num_articles, embedding_dim):
                super(MatrixFactorization, self).__init__()
                self.user_embedding = nn.Embedding(num_users, embedding_dim)
                self.article_embedding = nn.Embedding(num_articles, embedding_dim)

            def forward(self, user_ids, article_ids):
                user_embeddings = self.user_embedding(user_ids)
                article_embeddings = self.article_embedding(article_ids)
                scores = torch.sum(user_embeddings * article_embeddings, dim=1)
                return scores

        return MatrixFactorization(self.num_users, self.num_articles, self.embedding_dim)

    def get_recommendations(self):
        try:
            # Train the model
            self._train_model()

            # Make predictions
            predicted_articles = []
            for article in Article.objects.all():
                if article not in self.user.interactions.values('article'):
                    try:
                        article_id = torch.tensor([article.id - 1])
                        user_id = torch.tensor([self.user.id - 1])
                        score = self.model(user_id, article_id)
                        predicted_articles.append((article, score.item()))
                    except Exception as e:
                        print(f"Error predicting score for article {article.id}: {e}")
                        predicted_articles.append((article, 0))

            # Return Top N Recommended Articles
            N = 10
            return [a[0] for a in sorted(predicted_articles, key=lambda x: x[1], reverse=True)[:N]]
        except Exception as e:
            print(f"Error generating matrix factorization recommendations: {e}")
            # Return a fallback set of recommendations or an error message
            return Article.objects.all()[:10]  # Fallback

    def _train_model(self):
        try:
            criterion = nn.MSELoss()
            optimizer = optim.SGD(self.model.parameters(), lr=0.01)

            interactions = self.user.interactions.values('user_id', 'article_id')
            df = pd.DataFrame(interactions)

            for epoch in range(100):
                for index, row in df.iterrows():
                    try:
                        user_id = torch.tensor([row['user_id'] - 1])
                        article_id = torch.tensor([row['article_id'] - 1])
                        rating = torch.tensor([1])  # Assuming a rating of 1 for simplicity
                        optimizer.zero_grad()
                        scores = self.model(user_id, article_id)
                        loss = criterion(scores, rating)
                        loss.backward()
                        optimizer.step()
                    except Exception as e:
                        print(f"Training error at epoch {epoch}, row {index}: {e}")
        except Exception as e:
            print(f"Matrix factorization training failed: {e}")

class HybridRecommender(Recommender):
    def __init__(self, user):
        super().__init__(user)
        self.cbf_recommender = ContentBasedRecommender(user)
        self.cf_recommender = CollaborativeFilteringRecommender(user)
        self.mf_recommender = MatrixFactorizationRecommender(user)

    def get_recommendations(self):
        try:
            cbf_recommendations = self.cbf_recommender.get_recommendations()
            cf_recommendations = self.cf_recommender.get_recommendations()
            mf_recommendations = self.mf_recommender.get_recommendations()

            # Combine recommendations using a weighted hybrid approach
            hybrid_recommendations = self.combine_recommendations(
                cbf_recommendations, cf_recommendations, mf_recommendations
            )
            return hybrid_recommendations
        except Exception as e:
            print(f"Error generating hybrid recommendations: {e}")
            # Return a fallback set of recommendations or an error message
            return Article.objects.all()[:10]  # Fallback

    def combine_recommendations(self, *recommendations):
        try:
            weights = [0.4, 0.3, 0.3]
            combined = {}
            for i, recs in enumerate(recommendations):
                if recs:
                    for rec in recs:
                        if rec in combined:
                            combined[rec] += weights[i]
                        else:
                            combined[rec] = weights[i]
            return sorted(combined, key=combined.get, reverse=True)[:10]
        except Exception as e:
            print(f"Error combining recommendations: {e}")
            # Return a fallback set of recommendations or an error message
            return Article.objects.all()[:10]  # Fallback
