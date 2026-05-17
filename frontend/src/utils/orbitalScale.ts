export function scaleCoordinates(realDistanceKm: number, radius: number = 1): number {
  const SCALE_FACTOR = 0.015;
  const LOG_OFFSET = 2;
  const normalized = Math.log10(realDistanceKm + 1) - LOG_OFFSET;
  return Math.max(radius * 1.5, normalized * SCALE_FACTOR * 10);
}

export function getScaledPosition(averageDistanceKm: number, radius: number = 1): [number, number, number] {
  const scaled = scaleCoordinates(averageDistanceKm, radius);
  return [scaled, 0, 0];
}

export const ORBITAL_DATA = [
  { name: 'Mercury', distanceKm: 77000000, radius: 0.4, orbitalSpeed: 0.02, orbitRadius: 3.8 },
  { name: 'Venus', distanceKm: 108200000, radius: 0.9, orbitalSpeed: 0.015, orbitRadius: 5.2 },
  { name: 'Earth', distanceKm: 149600000, radius: 1, orbitalSpeed: 0.01, orbitRadius: 6.5 },
  { name: 'Moon', distanceKm: 384400, radius: 0.27, parent: 'Earth', orbitalSpeed: 0.03, orbitRadius: 1.5 },
  { name: 'Mars', distanceKm: 225000000, radius: 0.53, orbitalSpeed: 0.008, orbitRadius: 8.2 },
  { name: 'Jupiter', distanceKm: 778500000, radius: 2.5, orbitalSpeed: 0.004, orbitRadius: 12.5 },
  { name: 'Saturn', distanceKm: 1400000000, radius: 2, orbitalSpeed: 0.003, orbitRadius: 16.0 },
  { name: 'Uranus', distanceKm: 2900000000, radius: 1.5, orbitalSpeed: 0.002, orbitRadius: 20.0 },
  { name: 'Neptune', distanceKm: 4500000000, radius: 1.4, orbitalSpeed: 0.001, orbitRadius: 24.0 },
  { name: 'Pluto', distanceKm: 5900000000, radius: 0.2, orbitalSpeed: 0.0005, orbitRadius: 28.0 },
];

export const CELESTIAL_COORDS: Record<string, [number, number, number]> = {};
export const CAMERA_OFFSETS: Record<string, [number, number, number]> = {};

ORBITAL_DATA.forEach((planet, index) => {
  const scaledPosition = getScaledPosition(planet.distanceKm, planet.radius);
  CELESTIAL_COORDS[planet.name] = scaledPosition;
  
  const offset = planet.radius * 3;
  CAMERA_OFFSETS[planet.name] = [offset, offset * 0.6, offset];
});

CELESTIAL_COORDS['Sun'] = [0, 0, 0];
CAMERA_OFFSETS['Sun'] = [8, 5, 8];

CELESTIAL_COORDS['Asteroid Belt'] = [25, 2, 0];
CAMERA_OFFSETS['Asteroid Belt'] = [6, 3, 6];