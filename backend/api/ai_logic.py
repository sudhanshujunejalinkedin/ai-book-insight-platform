import os
from langchain_groq import ChatGroq
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv

load_dotenv()

class RAGPipeline:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.1-8b-instant",
            temperature=0  # Temperature 0 rakho taaki factual rahe
        )
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        self.db_path = "./chroma_db"

    def ingest_book(self, book_id, title, author, url, text):
        # Metadata ko top par force karna
        enriched_text = f"BOOK_TITLE: {title}\nAUTHOR: {author}\nPURCHASE_LINK: {url}\n\nCONTENT: {text}"
        chunks = self.text_splitter.split_text(enriched_text)
        Chroma.from_texts(
            texts=chunks, 
            embedding=self.embeddings, 
            persist_directory=self.db_path,
            collection_name=f"book_{book_id}"
        )

    def ask_question(self, book_id, query):
        query_lower = query.lower()
        
        # 1. Database Connection check
        if not os.path.exists(self.db_path):
            return {"answer": "Error: Database folder not found. Please run seed_data.py", "sources": 0}

        vectorstore = Chroma(
            persist_directory=self.db_path, 
            embedding_function=self.embeddings,
            collection_name=f"book_{book_id}"
        )
        
        # 2. Context Retrieval
        docs = vectorstore.similarity_search(query, k=3)
        if not docs:
            context = "No specific book content found."
        else:
            context = "\n\n".join([doc.page_content for doc in docs])

        # 3. Aggressive Prompting with Link Formatting Rule
        prompt = f"""
        System: You are a professional Book Analysis AI. 
        You MUST ONLY use the provided context. If the query is a greeting, greet only in relation to the book mentioned in context.
        
        STRICT RULES:
        1. Never talk about books NOT in the context.
        2. Always check the 'BOOK_TITLE' field in the context.
        3. Use Markdown for formatting: ## for headers, ** for bold, * for bullets.
        4. CRITICAL: If providing a link or URL, you MUST format it as a clickable Markdown link using the book title. 
           Format: [Book Title - Click here to Buy/Read](URL)

        Context:
        {context}

        User Query: {query}

        Response:
        """

        try:
            response = self.llm.invoke(prompt)
            # 4. Raw Text Fix: Ensure response is stripped and clean
            return {"answer": response.content.strip(), "sources": len(docs)}
        except Exception as e:
            return {"answer": "AI busy, try again.", "sources": 0}