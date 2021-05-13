from articles.api.views import FinalCSVViewSet, PortfolioViewSet, UserViewSet, PortfolioStatsViewSet, StrategiesViewSet, CryptoViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path

router = DefaultRouter()
router.register(r'matrix', FinalCSVViewSet, basename='matrix')
router.register(r'portfolio', PortfolioViewSet, basename='portfolios')
router.register(r'user', UserViewSet, basename='users')
router.register(r'portfoliostats', PortfolioStatsViewSet, basename='portfoliostats')
router.register(r'strategies', StrategiesViewSet, basename='strategies')
router.register(r'crypto', CryptoViewSet, basename='crypto')
urlpatterns = router.urls