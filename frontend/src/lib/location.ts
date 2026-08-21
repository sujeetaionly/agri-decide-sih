export interface LocationResult {
  latitude: number;
  longitude: number;
  district: string;
  state: string;
}

export async function requestDeviceLocation(): Promise<LocationResult | null> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const geoInfo = resolveDistrictFromCoords(lat, lng);
        localStorage.setItem('krishi_farmer_district', geoInfo.district);
        localStorage.setItem('krishi_farmer_state', geoInfo.state);
        resolve({ latitude: lat, longitude: lng, district: geoInfo.district, state: geoInfo.state });
      },
      (err) => {
        console.warn('[Location] Geolocation prompt declined or timed out:', err);
        resolve(null);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

function resolveDistrictFromCoords(lat: number, lng: number): { district: string; state: string } {
  if (lat >= 18.0 && lat <= 22.0 && lng >= 73.0 && lng <= 80.0) {
    return { district: 'Pune', state: 'Maharashtra' };
  } else if (lat >= 21.0 && lat <= 26.5 && lng >= 74.0 && lng <= 82.0) {
    return { district: 'Indore', state: 'Madhya Pradesh' };
  } else if (lat >= 24.0 && lat <= 30.0 && lng >= 69.0 && lng <= 78.0) {
    return { district: 'Jaipur', state: 'Rajasthan' };
  } else if (lat >= 20.0 && lat <= 24.5 && lng >= 68.0 && lng <= 74.5) {
    return { district: 'Rajkot', state: 'Gujarat' };
  }
  return { district: 'Pune', state: 'Maharashtra' };
}
