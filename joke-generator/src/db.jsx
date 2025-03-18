import Dexie from "dexie";

// Initialize Dexie database
export const db = new Dexie("CameraAppDB");

// Define database schema
db.version(1).stores({
  photos: "++id, imageData", // For CameraCapture component
});

// Function to add a photo
export const addPhoto = async (imageData) => {
  try {
    console.log("Attempting to add photo to database...");
    const id = await db.photos.add({ imageData });
    console.log(`Photo saved to CameraAppDB with id: ${id}`);
  } catch (error) {
    console.error("Failed to save photo:", error);
  }
};

// Function to delete a photo
export const deletePhoto = async (id) => {
  try {
    console.log(`Attempting to delete photo with id: ${id}...`);
    await db.photos.delete(id);
    console.log(`Photo with id: ${id} deleted from CameraAppDB`);
  } catch (error) {
    console.error("Failed to delete photo:", error);
  }
};

// Function to get all photos
export const getAllPhotos = async () => {
  try {
    console.log("Fetching all photos from database...");
    const photos = await db.photos.toArray();
    console.log(`Retrieved ${photos.length} photos from database`);
    return photos;
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return [];
  }
};