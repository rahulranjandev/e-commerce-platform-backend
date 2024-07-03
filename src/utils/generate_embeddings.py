import os
import dotenv
from sentence_transformers import SentenceTransformer
import pymongo

dotenv.load_dotenv()

model = SentenceTransformer("all-MiniLM-L6-v2")

# Get the MongoDB URI from the environment variables
mongodb_uri = os.getenv("MONGODB_URL")
print(f"MongoDB URI: {mongodb_uri}")


def get_mongo_client(mongo_uri):
    """Establish connection to the MongoDB."""
    try:
        client = pymongo.MongoClient(mongo_uri)
        print("Connection to MongoDB successful")
        return client
    except pymongo.errors.ConnectionFailure as e:
        print(f"Connection failed: {e}")
        return None


client = get_mongo_client(mongodb_uri)


def generate_embeddings(text):
    try:
        return model.encode(text, show_progress_bar=True).tolist()
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None


def store_embeddings():
    try:
        db = client["shopnexus"]
        collection = db["products"]

        documents = collection.find()

        for doc in documents:
            embedding = generate_embeddings(doc["description"])

            collection.update_one(
                {"_id": doc["_id"]}, {"$set": {"embeddings": embedding}}
            )

            print("Embeddings stored successfully!")

    except Exception as e:
        print(f"Error storing embeddings: {e}")
        return None
    finally:
        if client:
            client.close()
            print("MongoDB connection closed.")


def delete_embeddings():
    try:
        db = client["shopnexus"]
        collection = db["products"]

        collection.update_many({}, {"$unset": {"embeddings": ""}})
        print("Embeddings deleted successfully!")
    except Exception as e:
        print(f"Error deleting embeddings: {e}")
    finally:
        if client:
            client.close()
            print("MongoDB connection closed.")


if __name__ == "__main__":
    store_embeddings()
    # delete_embeddings()
