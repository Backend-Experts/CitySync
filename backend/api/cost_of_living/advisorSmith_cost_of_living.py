import requests
import csv
import json
import os

# === CONFIGURATION ===
CSV_URL = "https://advisorsmith.com/wp-content/uploads/2021/02/advisorsmith_cost_of_living_index.csv"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get script's directory
COST_OF_LIVING_DIR = os.path.join(BASE_DIR)  # Cost of living folder where CSV is stored
DATA_DIR = os.path.join(BASE_DIR, "../data")  # Base data folder
COST_OF_LIVING_DATA_DIR = os.path.join(DATA_DIR, "cost_of_living_data")  # Folder for processed JSON

CSV_FILE_PATH = os.path.join(COST_OF_LIVING_DIR, "advisorsmith_cost_of_living_index.csv")  # CSV file path
JSON_FILE_PATH = os.path.join(COST_OF_LIVING_DATA_DIR, "cost_of_living_data.json")  # JSON file path

# Ensure necessary directories exist
os.makedirs(COST_OF_LIVING_DATA_DIR, exist_ok=True)

# === 1️⃣ Download the Cost of Living Data ===
def download_cost_of_living_data():
    try:
        response = requests.get(CSV_URL, stream=True)
        response.raise_for_status()  # Raise an error if request fails

        with open(CSV_FILE_PATH, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)

        print(f"✅ Cost of Living data downloaded successfully to {CSV_FILE_PATH}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Error downloading Cost of Living data: {e}")
        exit(1)

# === 2️⃣ Process CSV and Convert to JSON ===
def process_cost_of_living_data():
    cost_of_living_data = {}

    try:
        with open(CSV_FILE_PATH, mode="r", encoding="utf-8") as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                city = row["City"].strip()
                state = row["State"].strip()
                index = float(row["Cost of Living Index"])  # Convert index to float

                location_key = f"{city}, {state}"
                cost_of_living_data[location_key] = {
                    "city": city,
                    "state": state,
                    "cost_of_living_index": index
                }

        # Save as JSON in the cost_of_living_data folder
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as json_file:
            json.dump(cost_of_living_data, json_file, indent=4)

        print(f"✅ Processed Cost of Living data saved to {JSON_FILE_PATH}")

    except FileNotFoundError:
        print(f"❌ Error: CSV file {CSV_FILE_PATH} was not found.")
    except Exception as e:
        print(f"❌ An error occurred while processing Cost of Living data: {e}")

# === RUN SCRIPT ===
if __name__ == "__main__":
    download_cost_of_living_data()
    process_cost_of_living_data()