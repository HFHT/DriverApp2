import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import { useMemo } from "react"
import { useRouteMarkers } from "./useRouteMarkers"
import { useMarkerClusters } from "./useMarkerClusters"
import { IconTruck } from "@tabler/icons-react"

export function RouteMarkers() {
    const { setMarkerRef, resetMarkerRef } = useMarkerClusters()
    const { route, handleConstituentSelect, truckLocations, home } = useRouteMarkers(resetMarkerRef)

    const stops = useMemo(() => {
        if (!route || route.length < 1) return []
        // console.log('RouteMarkers-useMemo-stop', route)
        return route.map((rm, idx) =>
            <AdvancedMarker key={idx}
                title={`${rm.title}`}
                clickable={true}
                onClick={(e) => handleConstituentSelect(idx + 1)}
                ref={marker => setMarkerRef(marker, rm.key.toString())}
                position={rm.position}>
                <Pin
                    background={rm.pin.bgc}
                    glyph={rm.pin.glyph.toString()}
                    glyphColor={rm.pin.gc}
                    borderColor={'#000'}
                />
            </AdvancedMarker>
        )
    }, [route])

    const trucks = useMemo(() => {
        if (!truckLocations || truckLocations.length < 1) return []
        // console.log('RouteMarkers-useMemo-trucks', truckLocations)
        return truckLocations.map((tm, idx) =>
            <AdvancedMarker key={idx}
                clickable={true}
                onClick={() => { }}
                title={tm._id}
                position={tm.gps}>
                <IconTruck color={tm.bgc} height={34} width={34} />
            </AdvancedMarker>
        )
    }, [truckLocations])

    if (!route) return <></>
    return (
        <>
            {stops}
            {trucks}
            {home &&
                <AdvancedMarker position={home.gps} title={`${home._id}`} clickable={true} onClick={() => { }}>
                    <Pin background={home.bgc} glyphColor={'white'} borderColor={'#000'} glyph={'H'} scale={.9} />
                </AdvancedMarker>
            }
        </>
    )
}
