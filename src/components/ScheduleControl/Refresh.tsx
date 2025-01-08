import { Tooltip } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useRefresh } from "./useRefresh";
interface RefreshInterface {
    open: boolean
}
export function Refresh({ open }: RefreshInterface) {
    const { fetchSchedule, date } = useRefresh(20)
    if (!open) return <></>
    return (
        <Tooltip label='Refresh Schedule'>
            <IconRefresh onClick={() => fetchSchedule(date)} title='Refresh Schedule' />
        </Tooltip>
    )
}
