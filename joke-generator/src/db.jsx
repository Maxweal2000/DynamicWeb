// src/db.jsx

import Dexie from "dexie"; 
import { useLiveQuery } from "dexie-react-hooks"; 

// ✅ Initialize Dexie database
export const db = new Dexie("joke-photos");

// ✅ Define table schema
db.version(1).stores({
  photos: "id, timestamp, imgSrc" // 'id' as the primary key, timestamp for ordering, and imgSrc for image data
});

// ✅ Console logs for tracking database operations
db.on("populate", () => console.log("Database populated"));
db.on("ready", () => console.log("Database is ready"));
db.on("error", (error) => console.error("Database error:", error));

// ✅ Local Storage Sync Function
const syncWithLocalStorage = async () => {
  try {
    const photos = await db.photos.toArray();
    console.log("Syncing with Local Storage. Total photos:", photos.length);
    
    // Store photos in localStorage
    localStorage.setItem("photoGallery", JSON.stringify(photos));
    
    console.log("Photos saved to localStorage");
  } catch (error) {
    console.error("Failed to sync with localStorage:", error);
  }
};

// ✅ Hooks to automatically sync changes with localStorage
db.photos.hook("creating", () => {
  console.log("Photo added to IndexedDB");
  syncWithLocalStorage();
});

db.photos.hook("deleting", () => {
  console.log("Photo removed from IndexedDB");
  syncWithLocalStorage();
});


// ✅ Async function to add a photo
export async function addPhoto(id, imgSrc) {
  console.log("Adding photo:", imgSrc.length, id);

  try {
    await db.photos.put({
      id: id,           // Unique ID
      timestamp: new Date().toISOString(),  // Current timestamp
      imgSrc: imgSrc    // Base64 encoded image data
    });

    console.log(`Photo added successfully: ${id}`);
  } catch (error) {
    console.error(`Failed to add photo: ${error}`);
  }
}

// ✅ Function to get the photo source by task ID using live queries
export function GetPhotoSrc(id) {
  console.log("Fetching photo with ID:", id);

  const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());

  console.table(img);

  // If photo exists, return the image source
  if (Array.isArray(img) && img.length > 0) {
    return img[0]?.imgSrc;
  }
  return null;
}

// ✅ Function to get all photos using live query
export function useAllPhotos() {
  return useLiveQuery(() => db.photos.toArray()) || [];
}

export default db;

