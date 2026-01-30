from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import base64
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage


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
    """Generate a cinematic image using Gemini Nano Banana"""
    try:
        # Check cache first
        if request.section_id in generated_images_cache:
            logger.info(f"Returning cached image for section: {request.section_id}")
            return ImageGenerationResponse(
                image_data=generated_images_cache[request.section_id],
                section_id=request.section_id
            )
        
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")
        
        # Create a unique session for this generation
        session_id = f"image-gen-{request.section_id}-{uuid.uuid4()}"
        
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message="You are an expert cinematic image generator. Create stunning, high-quality, professional images suitable for website backgrounds."
        )
        
        chat.with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])
        
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

        msg = UserMessage(text=enhanced_prompt)
        
        logger.info(f"Generating image for section: {request.section_id}")
        text_response, images = await chat.send_message_multimodal_response(msg)
        
        if not images or len(images) == 0:
            raise HTTPException(status_code=500, detail="No image was generated")
        
        # Get the first generated image
        image_data = images[0]['data']
        
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