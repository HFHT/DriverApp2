import { Tooltip } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useRefresh } from "./useRefresh";

export function Refresh() {
    const { fetchSchedule, date } = useRefresh(20)
    return (
        <Tooltip label='Refresh Schedule'>
            <IconRefresh onClick={() => fetchSchedule(date)} title='Refresh Schedule' />
        </Tooltip>
    )
}
