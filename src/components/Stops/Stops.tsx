import { useContext } from "react"
import { MapView, Refresh, RouteControl, ScheduleControl, StopCards } from ".."
import { MainContext } from "@/contexts"
import { Grid } from "@mantine/core"
interface StopsInterface {
    open: boolean
}
export function Stops({ open }: StopsInterface) {
    const { state } = useContext(MainContext)
    return (
        <>
            <Grid grow align='center'>
                <Grid.Col span={10} >
                    <RouteControl open={open} />
                </Grid.Col>
                <Grid.Col span={1}>
                    <Refresh open={open} />
                </Grid.Col>
            </Grid>
            <ScheduleControl open={open} />
            <StopCards open={open && state.view === 'Schedule'} />
            <MapView open={open && state.view === 'Map'} />
        </>
    )
}
