// Functions to generate and store embeddings for the given data
// 1. Load the data from the database
// 2. Generate embeddings for the data
// 3. Store the embeddings in the database

// Using Python Script to Generate Embeddings
// File: generate_embeddings.py

// To Run the Script: python generate_embeddings.py
// Use Child Process to Run the Python Script from Node.js Code
// Cron Job to Run the Script Periodically to Update the Embeddings
// File: generateEmbeddings.ts

import { spawn } from 'child_process';
import { connectDB } from './connectDB';
import { Product } from '../models/productModel';

// Function to Generate Embeddings
const generateEmbeddings = async () => {
  try {
    // For development
    const pythonProcess = spawn('python', ['src/utils/generate_embeddings.py']);
    // For production
    // const pythonProcess = spawn('python', ['dist/src/utils/generate_embeddings.py']);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python script output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python script exited successfully.');
      } else {
        console.error(`Python script exited with code: ${code}`);
      }
    });
  } catch (error) {
    console.error('Error spawning Python process:', error);
  }
};

// Check the Database have New Data
// If Yes, Generate Embeddings
// If No, Do Nothing

// Function to check for new data and generate embeddings
const checkAndGenerateEmbeddings = async () => {
  try {
    await connectDB();
    let newRecords = false;

    // Implement your logic to check for new data in the database
    // This could involve querying for records with a "created_at" timestamp
    // or a flag indicating if embeddings are generated.
    const hasNewData = await Product.find({ embeddings: { $exists: false } });

    if (hasNewData) {
      newRecords = true;
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

export { checkAndGenerateEmbeddings, generateEmbeddings };
