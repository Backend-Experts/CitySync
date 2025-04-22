import requests
import os
import json
import boto3
import csv
import logging
import re
from io import StringIO

# === CONFIGURATION ===
ZHVI_CSV_URL = "https://files.zillowstatic.com/research/public_csvs/zhvi/City_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv?t=1741238936"
S3_BUCKET = os.getenv("S3_BUCKET", "citysync-ingestion-data")
CSV_S3_KEY = "zhvi_data.csv"
JSON_S3_KEY = "zhvi_data.json"

# AWS S3 Client
s3 = boto3.client("s3")

# Logging configuration
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def verify_s3_bucket():
    """Ensures the S3 bucket exists; if not, creates it."""
    try:
        s3.head_bucket(Bucket=S3_BUCKET)
        logger.info(f"S3 bucket '{S3_BUCKET}' exists.")
    except s3.exceptions.ClientError:
        logger.warning(f"S3 bucket '{S3_BUCKET}' not found. Creating it...")
        s3.create_bucket(Bucket=S3_BUCKET)
        logger.info(f"Created S3 bucket '{S3_BUCKET}'.")

def download_zhvi_data() -> bool:
    """Streams Zillow ZHVI data directly to S3 to minimize memory usage."""
    try:
        with requests.get(ZHVI_CSV_URL, stream=True, timeout=60) as response:
            response.raise_for_status()
            # Stream the response directly into S3 without loading the whole file in memory
            s3.upload_fileobj(response.raw, S3_BUCKET, CSV_S3_KEY)
        logger.info(f"Zillow ZHVI data successfully streamed to S3: {S3_BUCKET}/{CSV_S3_KEY}")
        return True
    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout error downloading Zillow data: {e}")
        return False
    except requests.exceptions.RequestException as e:
        logger.error(f"Error downloading Zillow data: {e}")
        return False

def process_zhvi_data() -> bool:
    """
    Processes the CSV from S3 row-by-row and writes JSON incrementally to a temporary file,
    then uploads the file to S3.
    """
    try:
        # Retrieve CSV object from S3
        csv_obj = s3.get_object(Bucket=S3_BUCKET, Key=CSV_S3_KEY)
        # Use iter_lines() to avoid loading the entire file into memory
        csv_lines = csv_obj["Body"].iter_lines()
        # Decode each line and create a CSV reader
        csv_reader = csv.DictReader(line.decode("utf-8") for line in csv_lines)

        # Use /tmp directory to write the output file (Lambda provides up to 512 MB in /tmp)
        tmp_json_path = "/tmp/zhvi_data.json"
        with open(tmp_json_path, "w", encoding="utf-8") as outfile:
            outfile.write("[")  # Start JSON array
            first = True
            date_pattern = re.compile(r"\d{4}-\d{2}")  # Matches YYYY-MM columns
            count = 0
            for row in csv_reader:
                zhvi_values = {key: row[key] for key in row.keys() if date_pattern.match(key)}
                city_data = {
                    "city": row.get("RegionName", ""),
                    "state": row.get("StateName", ""),
                    "size_rank": row.get("SizeRank", ""),
                    "zhvi_values": zhvi_values
                }
                # Write comma if not the first record
                if not first:
                    outfile.write(",")
                else:
                    first = False
                json.dump(city_data, outfile)
                count += 1
                if count % 1000 == 0:
                    logger.info(f"Processed {count} records...")
            outfile.write("]")  # End JSON array

        # Upload the file from /tmp to S3
        s3.upload_file(tmp_json_path, S3_BUCKET, JSON_S3_KEY, ExtraArgs={"ContentType": "application/json"})
        logger.info(f"Processed ZHVI data saved to S3: {S3_BUCKET}/{JSON_S3_KEY}")
        return True
    except Exception as e:
        logger.error(f"Error processing Zillow data: {e}")
        return False

def lambda_handler(event: dict, context: object) -> dict:
    """AWS Lambda function to fetch and process Zillow ZHVI data."""
    logger.info("Starting ZHVI data ingestion...")
    verify_s3_bucket()  # Ensure the S3 bucket exists
    if download_zhvi_data():
        if process_zhvi_data():
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Zillow data successfully processed and stored in S3."})
            }
    return {
        "statusCode": 500,
        "body": json.dumps({"error": "Failed to fetch or process Zillow data."})
    }

if __name__ == "__main__":
    # For local testing
    lambda_handler({}, None)