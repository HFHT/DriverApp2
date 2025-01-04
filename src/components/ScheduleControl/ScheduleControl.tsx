import { MainContext } from "@/contexts";
import { SegmentedControl, SimpleGrid } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useContext } from "react";
import { useScheduleControl } from "./useScheduleControl";
interface ScheduleControlInterface {
    open: boolean
}
export function ScheduleControl({ open }: ScheduleControlInterface) {
    const { state, dispatch } = useContext(MainContext)
    const { apptDate, getApptDate } = useScheduleControl()
    if (!open || !state || state.date === undefined) return <></>
    return (
        <SimpleGrid cols={2} mt='sm'>
            <DateInput value={new Date(state.date)} valueFormat='YYYY-MM-DD' onChange={(e) => {
                dispatch({ type: 'setDate', payload: e })
                getApptDate(e)
            }} />
            <SegmentedControl value={state.view} data={['Map', 'Schedule']} onChange={(e) => dispatch({ type: 'setView', payload: e })} />
        </SimpleGrid>
    )
}
