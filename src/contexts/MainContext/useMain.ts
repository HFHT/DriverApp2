import { MainContext } from "@/contexts"
import { fetchServices } from "@/services"
import { useContext, useEffect, useState } from "react"
import { theDate } from "@/utils";
import { fetchSAS } from "@/services/fetch/fetchSAS";

export function useMain() {
    const { dispatch } = useContext(MainContext)
    const [results, setResults] = useState(undefined)
    const [sasToken, setSasToken] = useState<{ url: any; sasKey: any; } | undefined>(undefined)

    useEffect(() => {
        fetchSasToken()
    }, [])

    const fetchSasToken = async () => {
        setSasToken(await fetchSAS())
    }
    const fetchSchedule = async (theDate: string | undefined) => {
        try {
            let retVal = await fetchServices({
                _id: theDate,
                cmds: [
                    { cmd: 'schedDate', jsonValue: {} },
                ]
            })
            if (retVal.err) {
                console.warn('fetchSchedule-error')
            } else {
                dispatch({ type: 'setSchedule', payload: retVal })
            }
        } catch (error) {
            console.warn('fetchSchedule-catch', error)
        }
        // setResults(
        //     await fetchServices({
        //         _id: theDate,
        //         cmds: [
        //             { cmd: 'schedDate', jsonValue: {} },
        //         ]
        //     })
        // )
    }

    // useEffect(() => {
    //     fetchSchedule('2024-12-02')
    // }, [])

    return { results, fetchSchedule, sasToken } as const
}
