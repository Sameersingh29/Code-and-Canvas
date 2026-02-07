from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
import base64
from datetime import datetime, timezone
import google.generativeai as genai
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Image Generation Models
class ImageGenerationRequest(BaseModel):
    prompt: str
    section_id: str  # Unique identifier for caching


class ImageGenerationResponse(BaseModel):
    image_data: str  # Base64 encoded image
    section_id: str


# Store generated images in memory cache
generated_images_cache = {}

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@api_router.post("/generate-image", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    """Generate a cinematic image using Google Gemini"""
    try:
        # Check cache first
        if request.section_id in generated_images_cache:
            logger.info(f"Returning cached image for section: {request.section_id}")
            return ImageGenerationResponse(
                image_data=generated_images_cache[request.section_id],
                section_id=request.section_id
            )
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
        
        # Configure Gemini API
        genai.configure(api_key=api_key)
        
        # Enhanced cinematic prompt
        enhanced_prompt = f"""Create a stunning, cinematic, high-resolution image for a professional business website background.
        
Theme: {request.prompt}

Style requirements:
- Ultra high quality, 4K resolution feel
- Cinematic lighting with dramatic shadows
- Dark, moody atmosphere suitable for white text overlay
- Professional and modern aesthetic
- Subtle depth of field effect
- Rich colors but not oversaturated
- Suitable for a web agency/design studio website

The image should evoke professionalism, creativity, and innovation."""
        
        logger.info(f"Generating image for section: {request.section_id}")
        
        # Use Gemini 2.0 Flash for image generation
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(enhanced_prompt)
        
        # Check if response contains images
        if not response.parts:
            raise HTTPException(status_code=500, detail="No image was generated")
        
        # Extract image data from response
        image_part = None
        for part in response.parts:
            if part.mime_type.startswith('image/'):
                image_part = part
                break
        
        if not image_part or not image_part.data:
            raise HTTPException(status_code=500, detail="No image data in response")
        
        # Encode image to base64
        image_data = base64.b64encode(image_part.data).decode('utf-8')
        
        # Cache the result
        generated_images_cache[request.section_id] = image_data
        
        logger.info(f"Successfully generated image for section: {request.section_id}")
        
        return ImageGenerationResponse(
            image_data=image_data,
            section_id=request.section_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")


@api_router.get("/generated-image/{section_id}")
async def get_generated_image(section_id: str):
    """Get a previously generated image as raw bytes"""
    if section_id not in generated_images_cache:
        raise HTTPException(status_code=404, detail="Image not found. Generate it first.")
    
    image_data = generated_images_cache[section_id]
    image_bytes = base64.b64decode(image_data)
    
    return Response(content=image_bytes, media_type="image/png")


# Contact Form Models
class ContactFormRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=2000)


class ContactFormResponse(BaseModel):
    success: bool
    message: str


@api_router.post("/send-contact", response_model=ContactFormResponse)
async def send_contact_email(request: ContactFormRequest):
    """Send contact form email via Gmail SMTP"""
    try:
        smtp_email = os.getenv("SMTP_EMAIL")
        smtp_password = os.getenv("SMTP_PASSWORD")
        
        if not smtp_email or not smtp_password:
            logger.error("SMTP credentials not configured")
            raise HTTPException(status_code=500, detail="Email service not configured")
        
        # Create email message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Contact Form Submission from {request.name}"
        msg['From'] = smtp_email
        msg['To'] = smtp_email  # Send to inquirecodeandcanvas@gmail.com
        msg['Reply-To'] = request.email  # So you can reply directly to the sender
        
        # Plain text version
        text_content = f"""
New Contact Form Submission

Name: {request.name}
Email: {request.email}

Message:
{request.message}

---
This email was sent from the Code and Canvas website contact form.
"""
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }}
        .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
        .field {{ margin-bottom: 20px; }}
        .label {{ font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }}
        .value {{ font-size: 16px; color: #1f2937; margin-top: 5px; }}
        .message-box {{ background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #7c3aed; margin-top: 10px; }}
        .footer {{ text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone wants to work with you!</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Name</div>
                <div class="value">{request.name}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:{request.email}" style="color: #7c3aed;">{request.email}</a></div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="message-box">{request.message.replace(chr(10), '<br>')}</div>
            </div>
        </div>
        <div class="footer">
            Sent from Code and Canvas website contact form
        </div>
    </div>
</body>
</html>
"""
        
        part1 = MIMEText(text_content, 'plain')
        part2 = MIMEText(html_content, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email via Gmail SMTP
        logger.info(f"Attempting to send contact email from {request.name} ({request.email})")
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(smtp_email, smtp_password)
            server.send_message(msg)
        
        logger.info(f"Successfully sent contact email from {request.name}")
        
        # Store in database for records
        contact_doc = {
            "id": str(uuid.uuid4()),
            "name": request.name,
            "email": request.email,
            "message": request.message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "email_sent": True
        }
        await db.contact_submissions.insert_one(contact_doc)
        
        return ContactFormResponse(
            success=True,
            message="Thank you! Your message has been sent successfully."
        )
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Email authentication failed")
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Error sending contact email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()