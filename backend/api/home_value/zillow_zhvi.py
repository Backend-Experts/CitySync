import requests
import os
import pandas as pd
import json

# === CONFIGURATION ===
ZHVI_CSV_URL = "https://files.zillowstatic.com/research/public_csvs/zhvi/City_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv?t=1741238936"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get current script directory
HOME_VALUE_DIR = os.path.join(BASE_DIR)  # Home value folder where CSV is stored
DATA_DIR = os.path.join(BASE_DIR, "../data")  # Base data folder
ZILLOW_HOME_VALUE_DIR = os.path.join(DATA_DIR, "zillow_home_value")  # Folder for processed JSON

CSV_FILE_PATH = os.path.join(HOME_VALUE_DIR, "zhvi_data.csv")  # CSV file path
JSON_FILE_PATH = os.path.join(ZILLOW_HOME_VALUE_DIR, "zhvi_data.json")  # JSON file path

# Ensure necessary directories exist
os.makedirs(ZILLOW_HOME_VALUE_DIR, exist_ok=True)

# === 1️⃣ Download the Zillow ZHVI Data ===
def download_zhvi_data():
    try:
        response = requests.get(ZHVI_CSV_URL, stream=True)
        response.raise_for_status()  # Raise an error if request fails

        with open(CSV_FILE_PATH, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)

        print(f"✅ Zillow ZHVI data downloaded successfully to {CSV_FILE_PATH}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Error downloading Zillow ZHVI data: {e}")
        exit(1)

# === 2️⃣ Process CSV and Convert to JSON ===
def process_zhvi_data():
    try:
        # Load the CSV file
        df = pd.read_csv(CSV_FILE_PATH)

        # Select relevant columns (Modify this if needed)
        relevant_columns = ["RegionName", "StateName", "SizeRank"] + list(df.columns[-12:])  # Last 12 months of ZHVI data
        df_filtered = df[relevant_columns]

        # Convert to dictionary format for easy JSON storage
        zhvi_dict = df_filtered.to_dict(orient="records")

        # Save as JSON in the Zillow home value folder
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as json_file:
            json.dump(zhvi_dict, json_file, indent=4)

        print(f"✅ Processed ZHVI data saved to {JSON_FILE_PATH}")

    except FileNotFoundError:
        print(f"❌ Error: CSV file {CSV_FILE_PATH} was not found.")
    except Exception as e:
        print(f"❌ An error occurred while processing ZHVI data: {e}")

# === RUN SCRIPT ===
if __name__ == "__main__":
    download_zhvi_data()
    process_zhvi_data()