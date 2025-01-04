import { MainContext, ScheduleContext } from "@/contexts";
import { SchedulerStopType, StopDetailJoined } from "@/contexts/ScheduleContext/useGetApptsforDay";
import { useTheme } from "@/hooks";
import { Badge, Card, Grid, Text } from "@mantine/core";
import { IconCubeSend, IconTruck } from "@tabler/icons-react";
import { useContext } from "react";

interface StopCardInterface {
    stopDetail: SchedulerStopType
    stopNumber: number
}
export function StopCard({ stopDetail, stopNumber }: StopCardInterface) {
    const { state, joinStopDetail, dispatch } = useContext(ScheduleContext)
    // const { dispatch } = useContext(MainContext)
    const { dark } = useTheme()
    let joinedStop: StopDetailJoined = joinStopDetail(stopDetail)
    if (!joinedStop.appt || !joinedStop.donor || !joinedStop.donation) { console.warn('StopCard appt, donor or donation not found', stopDetail, state.donors, state.donations); return }
    const statusColor = () => {
        if (stopDetail.status.code === 'cancelled') return 'red';
        if (stopDetail.status.code === 'completed') return 'green';
        if (stopDetail.status.code === 'resched') return 'orange';
        return undefined
    }
    return (
        <>
            <Card withBorder className='pointer' bg={statusColor()} onClick={() => dispatch({ type: 'setStop', payload: { ...stopDetail, stopNumber: stopNumber } })}>
                <Grid m={0} p={0} gutter={0} >
                    <Grid.Col span={6}>
                        <Text size='sm'>{`${joinedStop.donor.name.first} ${joinedStop.donor.name.last}`}</Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Text size='sm'>{joinedStop.donor.phone || joinedStop.donor._id}</Text>
                    </Grid.Col>
                    <Grid.Col span={2}>{stopDetail.type === 'pickup' ? <IconTruck /> : <IconCubeSend />}</Grid.Col>
                    <Grid.Col span={10}><Text size='sm'>{joinedStop.donor.name.company}</Text></Grid.Col>
                    <Grid.Col span={2}><Badge size='sm' circle variant='outline' color={dark ? 'gray' : 'black'}>{stopNumber.toString()}</Badge></Grid.Col>
                    <Grid.Col span={12}><Text size='sm'>{`${joinedStop.donor.place.num} ${joinedStop.donor.place.route} `}<b><i>{joinedStop.donor.place.address2}</i></b></Text></Grid.Col>
                    <Grid.Col span={6}><Text size='sm'>{joinedStop.donor.place.city}</Text></Grid.Col>
                    <Grid.Col span={4}><Text size='sm'>{joinedStop.donor.place.zip}</Text></Grid.Col>
                    <Grid.Col span={12}><Text size='sm'>{joinedStop.donation.driverNote}</Text></Grid.Col>
                </Grid>
            </Card>
        </>
    )
}
