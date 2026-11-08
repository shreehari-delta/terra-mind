import rasterio
from rasterio.transform import from_origin
import numpy as np

# Generate a 100x100 matrix of random pixel values (simulating a satellite band)
data = np.random.randint(0, 255, (100, 100), dtype=np.uint8)

# Define mock geospatial coordinates (longitude, latitude) and resolution
transform = from_origin(-120.0, 45.0, 0.01, 0.01)

# Create the valid GeoTIFF file
with rasterio.open(
    'sample_satellite.tif',
    'w',
    driver='GTiff',
    height=data.shape[0],
    width=data.shape[1],
    count=1,
    dtype=data.dtype,
    crs='EPSG:4326',
    transform=transform,
) as dst:
    dst.write(data, 1)

print("Success: 'sample_satellite.tif' created in your ai-engine folder!")