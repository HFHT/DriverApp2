import { ScheduleContext } from "@/contexts"
import { theDate } from "@/utils"
import { useContext, useState } from "react"

export function useScheduleControl() {
    const { dispatch, fetchSchedule, isBusy } = useContext(ScheduleContext)
    const [apptDate, setApptDate] = useState(undefined)

    const getApptDate = async (getDate: any) => {
        if (getDate === null) return
        console.log(theDate(getDate))
        const retVal = await fetchSchedule(getDate)
        dispatch({ type: 'set', payload: { ...retVal } })
        setApptDate(retVal)
    }
    return { apptDate, getApptDate, isBusy } as const
}
