import { RouteMarkers } from "@/components";
import { MainContext } from "@/contexts";
import { Box, LoadingOverlay } from "@mantine/core"
import { Map } from '@vis.gl/react-google-maps';
import { useContext } from "react";

interface MapViewInterface {
    open: boolean
}
export function MapView({ open }: MapViewInterface) {
    const { state } = useContext(MainContext)
    if (!open) return <></>
    return (
        <Box pos='relative'>
            <LoadingOverlay visible={false} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Map reuseMaps
                style={{ width: document.documentElement.clientWidth - 16, height: document.documentElement.clientHeight - 170 }}
                defaultZoom={10}
                defaultCenter={state.settings?.site?.mapCenter}
                mapId='DEMO_MAP_ID'
            >
                <RouteMarkers />
            </Map>

        </Box>
    )
}
