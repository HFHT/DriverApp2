import { useEffect, useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

export function useMarkerClusters() {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const clusterer = useRef<MarkerClusterer | null>(null);

    // Initialize MarkerClusterer, if the map has changed
    useEffect(() => {
        // console.log('useMarkerClusters-useEffect-map', !map, !clusterer.current)
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    // Update markers, if the markers array has changed
    useEffect(() => {
        // console.log('useMarkerClusters-useEffect-marker', markers, clusterer.current)
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        // console.log('useMarkerCluster', marker, key, markers)
        if (key === null || marker === null) return
        // if (marker && markers[key]) return;
        // if (!marker && !markers[key]) return;
        // console.log('useMarkerCluster', marker, key, markers)
        setMarkers(prev => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    const resetMarkerRef = () => {
        setMarkers({})
    }
    return { setMarkerRef, resetMarkerRef }

}
