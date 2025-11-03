import React, { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { number } from 'motion/react';
import { useTripDetail } from '@/app/provider';
import { Activity, Itinerary } from './Chatbox';

function GlobleMap() {

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    //@ts-ignore
    const {tripDetailInfo, setTripDetailInfo} = useTripDetail();

    useEffect(() => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? '';

      if (!mapContainerRef.current) return;

      // initialize map only once
      if (!mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-74.5, 40],
          zoom: 1.7,
          projection: 'globe',
        });
      }

      const map = mapRef.current;

      // remove any existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // collect bounds so we can fit the map to all markers
      const bounds = new mapboxgl.LngLatBounds();

      if (tripDetailInfo?.itinerary) {
        tripDetailInfo.itinerary.forEach((itinerary: Itinerary) => {
          itinerary.activities.forEach((activity: Activity) => {
            const lon = activity?.geo_coordinates?.longitude;
            const lat = activity?.geo_coordinates?.latitude;
            if (typeof lon === 'number' && typeof lat === 'number') {
              const marker = new mapboxgl.Marker({ color: 'red' })
                .setLngLat([lon, lat])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name ?? ''))
                .addTo(map);
              markersRef.current.push(marker);
              bounds.extend([lon, lat]);
            }
          });
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 1000 });
        }
      }

      return () => {
        // cleanup markers when component unmounts or tripDetailInfo changes
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];
      };
    }, [tripDetailInfo]);



    return (


    <div>
        <div ref={mapContainerRef}
        style={{
            widows: '95%',
            height: '85vh',
            borderRadius: 20

        }}
        />
    </div>
  )
}

export default GlobleMap