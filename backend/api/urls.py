from django.urls import path
from .views import BookListView, BookDetailView, AskAIView

urlpatterns = [
    path('books/', BookListView.as_view(), name='book-list'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('ask/', AskAIView.as_view(), name='ask-ai'),
]