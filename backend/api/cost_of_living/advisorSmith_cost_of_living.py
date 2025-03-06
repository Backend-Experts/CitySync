import requests
import csv
import json
import os

# === CONFIGURATION ===
CSV_URL = "https://advisorsmith.com/wp-content/uploads/2021/02/advisorsmith_cost_of_living_index.csv"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get script's directory
CSV_FILE_PATH = os.path.join(BASE_DIR, "advisorsmith_cost_of_living_index.csv")  # Local CSV file path
DATA_DIR = os.path.join(BASE_DIR, "../data")  # Data directory
JSON_FILE_PATH = os.path.join(DATA_DIR, "cost_of_living_data.json")  # Output JSON file

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# === 1. Download the latest CSV ===
try:
    response = requests.get(CSV_URL, stream=True)
    response.raise_for_status()  # Raise an error if the request fails

    # Save CSV file locally
    with open(CSV_FILE_PATH, "wb") as csv_file:
        for chunk in response.iter_content(chunk_size=1024):
            csv_file.write(chunk)

    print(f"Latest CSV downloaded to {CSV_FILE_PATH}")

except requests.exceptions.RequestException as e:
    print(f"Error downloading CSV: {e}")
    exit(1)

# === 2. Process CSV and Convert to JSON ===
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

    # Save the processed data to JSON
    with open(JSON_FILE_PATH, mode="w", encoding="utf-8") as json_file:
        json.dump(cost_of_living_data, json_file, indent=4)

    print(f"Processed data saved to {JSON_FILE_PATH}")

except FileNotFoundError:
    print(f"Error: CSV file {CSV_FILE_PATH} was not found.")
except Exception as e:
    print(f"An error occurred: {e}")