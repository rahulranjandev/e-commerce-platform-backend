// Functions to generate and store embeddings for the given data
// 1. Load the data from the database
// 2. Generate embeddings for the data
// 3. Store the embeddings in the database
// 4. Periodically update the embeddings based on new data

// Cron Job to Run the Periodically to Update the Embeddings

import axios from 'axios';
import { connectDB } from './connectDB';
import { Product } from '@/models/productModel';
import { VECTORS_BACKEND_URL } from '@config';

// Axios Configuration
const instance = axios.create({
  baseURL: VECTORS_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Function to Generate Embeddings using axios
const generateEmbeddings = async () => {
  try {
    // Make a POST request to the Python-Flask API to generate embeddings
    const response = await instance.post('/encode', {});

    if (response.status !== 200) {
      throw new Error('Failed to generate embeddings');
    }

    console.log('Embeddings generated and stored successfully.');
  } catch (error) {
    console.error('Error spawning Python process:', error);
  }
};

// Function to Delete Embeddings
const deleteEmbeddings = async () => {
  try {
    const response = await instance.post('/delete', {});

    if (response.status !== 200) {
      throw new Error('Failed to delete embeddings');
    }

    console.log('Embeddings deleted successfully.');
  } catch (error) {
    console.error('Error deleting embeddings:', error);
  }
};

// Function to Get Embeddings
const generate_vectors = async (data: any) => {
  try {
    // Send data in JSON format to the Python-Flask API
    const payload = JSON.stringify(data);

    const response = await instance.post('/generate_vectors', { payload });

    if (response.status !== 200) {
      throw new Error('Failed to get embeddings');
    }

    return response.data.embeddings;
  } catch (error) {
    console.error('Error getting embeddings:', error);
  }
};

// Function to check for new data and generate embeddings
const checkAndGenerateEmbeddings = async () => {
  try {
    await connectDB();
    // Query for records with recent created_at timestamp or without embeddings generated

    // const newData = await Product.find({ createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    // const newDataLastMinute = await Product.find({ createdAt: { $gt: new Date(Date.now() - 1 * 60 * 1000) } });
    const newDataLastFiveMinutes = await Product.find({ createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) } });

    if (newDataLastFiveMinutes.length > 0) {
      console.log('New data found. Generating embeddings...');
      generateEmbeddings();
    } else {
      console.log('No new data found. Skipping embedding generation.');
    }
  } catch (error) {
    console.error('Error checking and generating embeddings', error);
  }
};

// Run the function to check for new data and generate embeddings
// checkAndGenerateEmbeddings();
// generateEmbeddings();

export { checkAndGenerateEmbeddings, generateEmbeddings, deleteEmbeddings, generate_vectors };
