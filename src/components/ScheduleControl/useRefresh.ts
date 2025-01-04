import { useInterval } from "@/hooks"
import { MainContext, ScheduleContext } from "@/contexts";
import { useContext } from "react";

export function useRefresh(refreshRate: number) {
    const { state } = useContext(MainContext)
    const { fetchSchedule } = useContext(ScheduleContext)

    useInterval(
        () => {
            fetchSchedule(state.date)
        },
        ((state && state.settings && state.settings.site) ? state.settings.site.schedRefreshRate : refreshRate) * 60000
    )

    return { fetchSchedule, date: state.date }
}
