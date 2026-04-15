from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Book
from .serializers import BookSerializer
from .ai_logic import RAGPipeline

# 1. Dashboard ke liye: Saari books ki list nikalne ke liye
class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

# 2. Book Details ke liye: Ek single book ka data ID se nikalne ke liye
class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

# 3. AI Chat ke liye: Question puchne ke liye
class AskAIView(APIView):
    def post(self, request):
        book_id = request.data.get('book_id')
        query = request.data.get('query')

        if not book_id or not query:
            return Response(
                {"error": "book_id aur query dono zaroori hain!"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # AI Pipeline initialize karein
            rag = RAGPipeline()
            # RAG pipeline se answer maangein
            result = rag.ask_question(book_id, query)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )