import { MainContext } from '@/contexts'
import { useInterval } from '@/hooks/useInterval'
import { putTruckLocation } from '@/services/putTruckLocation'
import { notifications } from '@mantine/notifications'
import { useContext, useEffect, useState } from 'react'
export interface Ilocs extends Array<Iloc> { }
export interface Iloc {
    _id: string
    gps: {
        lat: number
        lng: number
    }
    ts: string
}
export function useTruckLocation(delay: number) {
    const { state, dispatch } = useContext(MainContext)
    const [hasGeolocation, setHasGeolocation] = useState(true)
    const [_locations, set_Locations] = useState([])

    useEffect(() => {
        if (!navigator.geolocation) {
            setHasGeolocation(false)
            notifications.show({
                color: 'yellow',
                title: `Location tracking is not active.`,
                message: 'Check to ensure that geolocation services are enabled for this device.'
            })
        } else {
            // navigator.geolocation.getCurrentPosition(locationTrack)
        }
    }, [])

    useInterval(
        () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(locationTrack)
            }
        },
        delay * 60000
    )

    async function locationTrack(position: any) {
        // console.log(position)
        if (!state.online || !businessHours() || !hasGeolocation) return
        const retVal = await putTruckLocation({
            _id: state.route,
            ts: new Date(),
            gps: { lat: position.coords.latitude, lng: position.coords.longitude }
        })
        console.log(retVal)
        dispatch({ type: 'setTrucks', payload: retVal.data })
    }
}

export const businessHours = () => {
    const today = new Date().getHours()
    return (today >= 8 && today <= 18)
}