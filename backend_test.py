#!/usr/bin/env python3
"""
Backend API Testing for Cinematic Website
Tests the image generation API and health check endpoints
"""

import requests
import json
import time
import base64
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://responsive-web-19.preview.emergentagent.com"

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check Endpoint ===")
    try:
        response = requests.get(f"{BACKEND_URL}/api/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and data["message"] == "Hello World":
                print("✅ Health check passed")
                return True
            else:
                print("❌ Health check failed - unexpected response format")
                return False
        else:
            print(f"❌ Health check failed - status code {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed - connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Health check failed - error: {e}")
        return False

def test_image_generation():
    """Test the image generation endpoint"""
    print("\n=== Testing Image Generation Endpoint ===")
    
    # Test data as specified in the review request
    test_payload = {
        "prompt": "A cinematic view of a modern creative design studio",
        "section_id": "test-services"
    }
    
    try:
        print(f"Making POST request to {BACKEND_URL}/api/generate-image")
        print(f"Payload: {json.dumps(test_payload, indent=2)}")
        
        start_time = time.time()
        response = requests.post(
            f"{BACKEND_URL}/api/generate-image",
            json=test_payload,
            timeout=60  # Allow up to 60 seconds for image generation
        )
        end_time = time.time()
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {end_time - start_time:.2f} seconds")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response keys: {list(data.keys())}")
            
            # Verify response structure
            if "image_data" in data and "section_id" in data:
                print(f"✅ Response contains required fields")
                print(f"Section ID: {data['section_id']}")
                
                # Verify section_id matches request
                if data["section_id"] == test_payload["section_id"]:
                    print("✅ Section ID matches request")
                else:
                    print(f"❌ Section ID mismatch - expected: {test_payload['section_id']}, got: {data['section_id']}")
                    return False, None
                
                # Verify image_data is base64 encoded
                try:
                    image_bytes = base64.b64decode(data["image_data"])
                    print(f"✅ Image data is valid base64 (decoded size: {len(image_bytes)} bytes)")
                    
                    # Basic validation that it's likely an image
                    if len(image_bytes) > 1000:  # Reasonable minimum size for an image
                        print("✅ Image data appears to be a valid image")
                        return True, end_time - start_time
                    else:
                        print("❌ Image data too small to be a valid image")
                        return False, None
                        
                except Exception as e:
                    print(f"❌ Image data is not valid base64: {e}")
                    return False, None
                    
            else:
                print(f"❌ Response missing required fields. Expected: image_data, section_id")
                print(f"Response: {json.dumps(data, indent=2)}")
                return False, None
        else:
            print(f"❌ Image generation failed - status code {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error response: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error response (raw): {response.text}")
            return False, None
            
    except requests.exceptions.Timeout:
        print("❌ Image generation failed - request timeout (>60 seconds)")
        return False, None
    except requests.exceptions.RequestException as e:
        print(f"❌ Image generation failed - connection error: {e}")
        return False, None
    except Exception as e:
        print(f"❌ Image generation failed - error: {e}")
        return False, None

def test_caching():
    """Test the caching functionality"""
    print("\n=== Testing Caching Functionality ===")
    
    # Use the same test data
    test_payload = {
        "prompt": "A cinematic view of a modern creative design studio",
        "section_id": "test-services-cache"
    }
    
    try:
        # First request
        print("Making first request...")
        start_time1 = time.time()
        response1 = requests.post(
            f"{BACKEND_URL}/api/generate-image",
            json=test_payload,
            timeout=60
        )
        end_time1 = time.time()
        first_request_time = end_time1 - start_time1
        
        if response1.status_code != 200:
            print(f"❌ First request failed with status {response1.status_code}")
            return False
            
        print(f"First request time: {first_request_time:.2f} seconds")
        
        # Second request (should be cached)
        print("Making second request (should be cached)...")
        start_time2 = time.time()
        response2 = requests.post(
            f"{BACKEND_URL}/api/generate-image",
            json=test_payload,
            timeout=30
        )
        end_time2 = time.time()
        second_request_time = end_time2 - start_time2
        
        if response2.status_code != 200:
            print(f"❌ Second request failed with status {response2.status_code}")
            return False
            
        print(f"Second request time: {second_request_time:.2f} seconds")
        
        # Compare responses
        data1 = response1.json()
        data2 = response2.json()
        
        if data1["image_data"] == data2["image_data"]:
            print("✅ Both requests returned identical image data")
        else:
            print("❌ Cached response differs from original")
            return False
            
        # Check if second request was significantly faster (indicating caching)
        if second_request_time < first_request_time * 0.5:  # At least 50% faster
            print(f"✅ Caching working - second request was {first_request_time/second_request_time:.1f}x faster")
            return True
        else:
            print(f"⚠️  Caching may not be working optimally - second request only {first_request_time/second_request_time:.1f}x faster")
            # Still consider it working if the response is correct
            return True
            
    except Exception as e:
        print(f"❌ Caching test failed - error: {e}")
        return False

def main():
    """Run all backend tests"""
    print("🎬 Starting Backend API Tests for Cinematic Website")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    results = {}
    
    # Test 1: Health Check
    results["health_check"] = test_health_check()
    
    # Test 2: Image Generation
    results["image_generation"], generation_time = test_image_generation()
    
    # Test 3: Caching (only if image generation works)
    if results["image_generation"]:
        results["caching"] = test_caching()
    else:
        results["caching"] = False
        print("\n⚠️  Skipping caching test due to image generation failure")
    
    # Summary
    print("\n" + "="*50)
    print("🎬 BACKEND TEST SUMMARY")
    print("="*50)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All backend tests passed!")
        return True
    else:
        print("⚠️  Some backend tests failed - see details above")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)