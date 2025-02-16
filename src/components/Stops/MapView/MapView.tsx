import { RouteMarkers } from "@/components";
import { MainContext } from "@/contexts";
import { Box, LoadingOverlay } from "@mantine/core"
import { Map } from '@vis.gl/react-google-maps';
import { useContext, useState } from "react";

interface MapViewInterface {
    open: boolean
}
export function MapView({ open }: MapViewInterface) {
    const { state } = useContext(MainContext)
    const [zoom, setZoom] = useState(10)
    const [center, setCenter] = useState(state.settings?.site?.mapCenter)
    if (!open) return <></>
    return (
        <Box pos='relative'>
            <LoadingOverlay visible={false} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Map reuseMaps
                style={{ width: document.documentElement.clientWidth - 16, height: document.documentElement.clientHeight - 170 }}
                defaultZoom={zoom}
                defaultCenter={center}
                mapId='DEMO_MAP_ID'
                onZoomChanged={(e) => { setZoom(e.detail.zoom) }}
                onCenterChanged={(e) => { setCenter(e.detail.center) }}
            >
                <RouteMarkers />
            </Map>

        </Box>
    )
}
