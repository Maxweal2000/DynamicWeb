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
    await db.photos.add({ imageData });
    console.log("Photo saved to CameraAppDB");
  } catch (error) {
    console.error("Failed to save photo:", error);
  }
};

// Function to delete a photo
export const deletePhoto = async (id) => {
  try {
    await db.photos.delete(id);
    console.log("Photo deleted from CameraAppDB");
  } catch (error) {
    console.error("Failed to delete photo:", error);
  }
};

// Function to get all photos
export const getAllPhotos = async () => {
  try {
    const photos = await db.photos.toArray();
    return photos;
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return [];
  }
};

export default db;

