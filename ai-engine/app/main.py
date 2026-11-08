import os
import tempfile
import rasterio
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TerraMind AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "TerraMind AI Engine is online"}

@app.get("/health")
async def health_check():
    return {"status": "operational", "service": "ai-engine"}

@app.post("/api/v1/analyze")
async def analyze_imagery(file: UploadFile = File(...)):
    # Ensure the file is a TIFF
    if not file.filename.lower().endswith(('.tif', '.tiff')):
        raise HTTPException(status_code=400, detail="Only GeoTIFF files (.tif, .tiff) are supported.")

    # Create a temporary file to securely process the upload
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".tif") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Open and analyze the image using Rasterio
        with rasterio.open(tmp_path) as dataset:
            metadata = {
                "filename": file.filename,
                "width": dataset.width,
                "height": dataset.height,
                "bands": dataset.count,
                "crs": str(dataset.crs) if dataset.crs else "Unspecified",
                "bounds": {
                    "left": dataset.bounds.left,
                    "bottom": dataset.bounds.bottom,
                    "right": dataset.bounds.right,
                    "top": dataset.bounds.top
                }
            }
            
            # Simulate AI Analysis: Calculate average density/value of Band 1
            if dataset.count > 0:
                band1 = dataset.read(1)
                metadata["mean_pixel_value"] = float(np.mean(band1))
                
        # Clean up the temporary file
        os.remove(tmp_path)
        
        return {
            "status": "success",
            "message": "Geospatial analysis complete",
            "data": metadata
        }
        
    except Exception as e:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")