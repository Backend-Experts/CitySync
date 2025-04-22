import requests
import os
import json
import boto3
import csv
import logging
import re
import gzip
from io import StringIO

# === CONFIGURATION ===
CSV_URL = "https://advisorsmith.com/wp-content/uploads/2021/02/advisorsmith_cost_of_living_index.csv"
S3_BUCKET = os.getenv("S3_BUCKET", "citysync-ingestion-data")
CSV_S3_KEY = "cost_of_living_data.csv"
JSON_S3_KEY = "cost_of_living_data.json"

# AWS S3 Client
s3 = boto3.client("s3")

# Logging configuration
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def verify_s3_bucket():
    """Checks if the S3 bucket exists; logs an error if not found."""
    try:
        s3.head_bucket(Bucket=S3_BUCKET)
        logger.info(f"S3 bucket '{S3_BUCKET}' exists.")
    except s3.exceptions.ClientError as e:
        logger.error(f"S3 bucket '{S3_BUCKET}' not accessible. Verify that it exists and your Lambda role has proper permissions.")
        raise e

def download_cost_of_living_data() -> bool:
    """Downloads Cost of Living CSV data and streams it directly to S3."""
    try:
        with requests.get(CSV_URL, stream=True, timeout=60) as response:
            response.raise_for_status()
            # Stream the CSV data directly into S3
            s3.upload_fileobj(response.raw, S3_BUCKET, CSV_S3_KEY)
        logger.info(f"Cost of Living data successfully streamed to S3: {S3_BUCKET}/{CSV_S3_KEY}")
        return True
    except Exception as e:
        logger.error(f"Error downloading Cost of Living data: {e}")
        return False

def process_cost_of_living_data() -> bool:
    """
    Reads the CSV file from S3, processes it into a JSON structure,
    and uploads the JSON file back to S3.
    If the file is gzip-compressed, it will be decompressed.
    """
    try:
        csv_obj = s3.get_object(Bucket=S3_BUCKET, Key=CSV_S3_KEY)
        csv_bytes = csv_obj["Body"].read()
        
        # Check if the data is gzip-compressed (GZIP files start with b'\x1f\x8b')
        if csv_bytes.startswith(b'\x1f\x8b'):
            logger.info("Detected gzip compression. Decompressing CSV data.")
            csv_content = gzip.decompress(csv_bytes).decode("utf-8")
        else:
            csv_content = csv_bytes.decode("utf-8")
        
        csv_reader = csv.DictReader(StringIO(csv_content))
        cost_of_living_data = {}
        
        for row in csv_reader:
            city = row["City"].strip()
            state = row["State"].strip()
            try:
                index = float(row["Cost of Living Index"])
            except ValueError:
                index = None
            location_key = f"{city}, {state}"
            cost_of_living_data[location_key] = {
                "city": city,
                "state": state,
                "cost_of_living_index": index
            }
        
        json_data = json.dumps(cost_of_living_data, indent=4)
        s3.put_object(
            Bucket=S3_BUCKET,
            Key=JSON_S3_KEY,
            Body=json_data,
            ContentType="application/json"
        )
        
        logger.info(f"Processed Cost of Living data saved to S3: {S3_BUCKET}/{JSON_S3_KEY}")
        return True
    except Exception as e:
        logger.error(f"Error processing Cost of Living data: {e}")
        return False

def lambda_handler(event: dict, context: object) -> dict:
    """AWS Lambda function to fetch, process, and store Cost of Living data in S3."""
    logger.info("Starting Cost of Living data ingestion...")
    
    try:
        verify_s3_bucket()
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "S3 bucket not accessible", "details": str(e)})
        }
    
    if download_cost_of_living_data():
        if process_cost_of_living_data():
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Cost of Living data successfully processed and stored in S3."})
            }
    return {
        "statusCode": 500,
        "body": json.dumps({"error": "Failed to fetch or process Cost of Living data."})
    }

if __name__ == "__main__":
    # For local testing
    lambda_handler({}, None)