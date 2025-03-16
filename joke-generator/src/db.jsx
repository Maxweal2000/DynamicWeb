// db.jsx
import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

// Create the Dexie database
class AppDB extends Dexie {
  constructor() {
    super("AppDB");
    this.version(1).stores({
      capturedImages: '++id, name, imageUrl, timestamp', // id is auto-incremented
    });
  }
}

const db = new AppDB();

// Save image data to IndexedDB
export const saveImageData = async (imageFile, metadata) => {
  const imageUrl = URL.createObjectURL(imageFile); // Temporary URL for the image
  
  // Save the image data to IndexedDB
  await db.capturedImages.add({
    name: imageFile.name,
    imageUrl,
    timestamp: new Date(),
    ...metadata,
  });

  console.log("Image data saved to IndexedDB.");
};

// Fetch all images from IndexedDB
export const useCapturedImages = () => {
  return useLiveQuery(() => db.capturedImages.toArray(), []);
};

// Delete an image by ID
export const deleteImage = async (id) => {
  await db.capturedImages.delete(id);
  console.log("Image deleted from IndexedDB.");
};

export default db;
