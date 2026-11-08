import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';

export const analyzeImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No GeoTIFF file provided' });
      return;
    }

    // Package the file from memory to send to Python
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Use environment variable for production, fallback to localhost for development
    const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://127.0.0.1:8000';

    // Forward the request to the FastAPI Engine
    const response = await axios.post(`${aiEngineUrl}/api/v1/analyze`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Relay the AI analysis back to the React frontend
    res.json(response.data);
  } catch (error: any) {
    console.error('AI Engine Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to communicate with AI Engine',
      details: error.response?.data || error.message 
    });
  }
};