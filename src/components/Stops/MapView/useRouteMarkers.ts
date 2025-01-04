import { useContext, useMemo } from "react"
import { MainContext, ScheduleContext } from "@/contexts"
import { SchedulerStopStatusType, StopDetailJoined } from "@/contexts/ScheduleContext/useGetApptsforDay"

export function useRouteMarkers(resetMarkerRef: () => void) {
    const { state, joinStopDetail, dispatch } = useContext(ScheduleContext)
    const { state: mainState } = useContext(MainContext)

    const fillPosition = (stopDetail: StopDetailJoined | undefined) => {
        if (!mainState || !mainState.settings || !mainState.settings.site) return { lat: 0, lng: 0 }
        if (stopDetail && stopDetail.donor) {
            return { lat: Number(stopDetail.donor.place.lat), lng: Number(stopDetail.donor.place.lng) }
        }
        return mainState.settings.site.locations[0].mapLocation
    }

    const fillGlyph = (stopDetail: StopDetailJoined | undefined, stopNumber: number, status: SchedulerStopStatusType) => {
        if (!mainState || !mainState.settings || !mainState.settings.trucks) return { glyph: stopNumber, bgc: 'black', gc: 'red' }
        let stopType = (stopDetail && stopDetail.donation && stopDetail.donation.type) ? stopDetail.donation.type : 'pickup'
        return {
            glyph: stopNumber,
            bgc: status.code !== 'open' ? 'gray' : mainState.settings.trucks[mainState.route][stopType].color,
            gc: status.code !== 'open' ? mainState.settings.trucks[mainState.route][stopType].color : 'white'
        }
    }
    const handleConstituentSelect = (stopNumber: number) => {
        // console.log('useRouteMarkers-handleConstituentSelect', state, stopNumber - 1)
        if (!state || !state.schedDate) {
            console.warn('useRouteMarkers-handleConstituentSelect state or state.schedDate are undefined')
            return
        }
        // console.log('useRouteMarkers-handleConstituentSelect', state.schedDate, stopNumber - 1)
        dispatch({ type: 'setStop', payload: { ...state.schedDate.stops.filter((sf) => sf.route === mainState.route)[stopNumber - 1], stopNumber: stopNumber } })
    }
    const route = useMemo(() => {
        if (!state || !state.schedDate || !state.schedDate.stops || state.schedDate?.stops.length < 1) return []
        // console.log('useRouteMarkers-useMemo', state)
        resetMarkerRef()
        return (state!.schedDate!.stops.filter((sf) => sf.route === mainState.route).map((ss, idx) => {
            let joinedStop: StopDetailJoined = joinStopDetail(ss)
            return {
                position: fillPosition(joinedStop),
                title: `${joinedStop.donor?.name.first} ${joinedStop.donor?.name.last}\n${joinedStop.donor?.place.addr}`,
                color: 'purple',
                pin: fillGlyph(joinedStop, idx + 1, ss.status),
                status: ss.status,
                key: ss.a_id
            }
        }))
    }, [state.schedDate, mainState.route])

    const home = useMemo(() => {
        // console.log('useRouteMarkers-useMemo-home', mainState)
        if (!mainState || !mainState.settings || !mainState.settings.site) return undefined
        return { _id: mainState.settings.site.locations[0].name, gps: mainState.settings.site.locations[0].mapLocation, bgc: 'tan' }
    }, [mainState.settings])

    const truckLocations = useMemo(() => {
        // console.log('useRouteMarkers-useMemo-truckLocations', mainState)
        if (!mainState || !mainState.settings || !mainState.settings.site) return undefined
        return mainState.truckLocations.map((tl) => (
            { _id: tl._id, gps: tl.gps, bgc: (mainState && mainState.settings) ? mainState.settings.trucks[tl._id]['pickup'].color : 'white' }
        ))
    }, [mainState.settings, mainState.truckLocations])

    return { route, handleConstituentSelect, truckLocations, home }
}
