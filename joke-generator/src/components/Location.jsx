import React, { useState, useEffect } from 'react';

const Location = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        localStorage.setItem("lastLocation", JSON.stringify(position.coords));
      });
    }
  }, []);

  return (
    <div>
      <h2>Your Location</h2>
      {location ? (
        <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default Location;
