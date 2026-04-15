import os
import django

# 1. Django Setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Book
from api.ai_logic import RAGPipeline

def seed_database():
    print("Starting Professional Database Refresh...")
    
    rag = RAGPipeline()
    
    # 2. Cleanup
    Book.objects.all().delete()
    print("Django database cleared.")

    # 3. 3-Book Dataset (High Quality)
    books_data = [
        {
            "id": 1,
            "title": "The Psychology of Money",
            "author": "Morgan Housel",
            "url": "https://www.goodreads.com/book/show/41881472",
            "description": "Timeless lessons on wealth, greed, and happiness.",
            "content": """
                Doing well with money isn’t necessarily about what you know. It’s about how you behave. 
                The book explains that financial success is a soft skill. 
                Key Concepts: 
                - No One’s Crazy: Everyone has a unique idea of how the world works. 
                - Luck & Risk: They are siblings, both are the reality that every outcome in life is guided by forces other than individual effort. 
                - Never Enough: Modern capitalism is a pro at making people feel like they don't have enough. 
                - Confounding Compounding: Warren Buffett’s fortune is due to the base he built in his teens and the longevity he maintained in his old age. 
                - Getting Wealthy vs. Staying Wealthy: Staying wealthy requires a combination of frugality and paranoia.
            """
        },
        {
            "id": 2,
            "title": "Atomic Habits",
            "author": "James Clear",
            "url": "https://www.goodreads.com/book/show/40121378",
            "description": "Small habits, giant results. A proven way to build good habits.",
            "content": """
                Atomic Habits is a definitive guide to breaking bad behaviors and adopting good ones in four steps. 
                It shows you how small, incremental, everyday routines compound into massive positive change over time.
                The 4 Laws of Behavior Change: 
                1. Make it Obvious (Cue)
                2. Make it Attractive (Craving)
                3. Make it Easy (Response)
                4. Make it Satisfying (Reward)
                Key Insight: You do not rise to the level of your goals. You fall to the level of your systems. 
                Focus on identity-based habits rather than outcome-based habits.
            """
        },
        {
            "id": 3,
            "title": "Deep Work",
            "author": "Cal Newport",
            "url": "https://www.goodreads.com/book/show/25744928",
            "description": "Rules for focused success in a distracted world.",
            "content": """
                Deep work is the ability to focus without distraction on a cognitively demanding task. 
                It's a skill that allows you to quickly master complicated information and produce better results in less time.
                The Rules of Deep Work:
                - Work Deeply: Build rituals and routines to minimize willpower usage.
                - Embrace Boredom: Train your brain to tolerate a lack of stimulus.
                - Quit Social Media: Use tools only if they offer substantial benefits.
                - Drain the Shallows: Schedule every minute of your day to avoid shallow tasks like constant emailing.
                Deep work is like a super power in our increasingly competitive twenty-first century economy.
            """
        }
    ]

    for data in books_data:
        # A. Save in Django
        Book.objects.create(
            id=data["id"],
            title=data["title"],
            author=data["author"],
            description=data["description"],
            url=data["url"]
        )

        # B. Ingest in AI Vector Store
        rag.ingest_book(
            book_id=data["id"],
            title=data["title"],
            author=data["author"],
            url=data["url"],
            text=data["content"]
        )
        print(f"Ingested: {data['title']}")

    print("\nSuccess! 3 Books are now available in Insight Engine.")

if __name__ == "__main__":
    seed_database()