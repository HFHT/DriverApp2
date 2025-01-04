import { Box, LoadingOverlay, ScrollArea, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useRef } from "react";
import { MainContext, ScheduleContext } from "@/contexts";
import { HomeCard, StopCard } from "@/components";
interface StopCardsInterface {
    open: boolean
}
export function StopCards({ open }: StopCardsInterface) {
    const { isBusy, state } = useContext(ScheduleContext)
    const { state: mainState, scrollPosition, onScrollPositionChange } = useContext(MainContext)
    const viewport = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (viewport && viewport.current) viewport.current!.scrollTo({ top: scrollPosition.y })
    }, [viewport.current])
    if (!open) return <></>
    if (!state || !state.schedDate || !state.schedDate.stops || state.schedDate?.stops.length < 1) return <Text size='sm' mt='xl'>No Routes scheduled for this day.</Text>
    const stops = () => {
        return state!.schedDate!.stops.filter((sf) => sf.route === mainState.route).map((ss, idx) =>
            <StopCard key={idx} stopDetail={ss} stopNumber={idx + 1} />
        )
    }
    return (
        <Box pos='relative'>
            <LoadingOverlay visible={isBusy} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <ScrollArea h={document.documentElement.clientHeight - 170} onScrollPositionChange={(e) => onScrollPositionChange(e)} viewportRef={viewport}>
                <Stack gap={3} mb='lg'>
                    {stops()}
                    <HomeCard />
                </Stack>
            </ScrollArea>
        </Box>
    )
}
