import React from "react";

const LocationDisplay = ({ location, geoError }) => {
  return (
    <>
      {location && (
        <div className="mt-4 bg-white shadow-lg rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Your Location</h3>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
      {geoError && <div className="mt-4 bg-red-500 text-white rounded-2xl p-6">{geoError}</div>}
    </>
  );
};

export default LocationDisplay;
