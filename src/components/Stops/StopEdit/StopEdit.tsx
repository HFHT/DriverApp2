import { ImageCarousel, ItemList, StopEditCard } from "@/components";
import { ScheduleContext } from "@/contexts";
import { Box, Button, Divider, Group, Image, LoadingOverlay, Modal, Text, Textarea, Title } from "@mantine/core";
import { useContext } from "react";
import { useStopEdit } from "./useStopEdit";

interface StopEditInterface {
    open: boolean
}
export function StopEdit({ open }: StopEditInterface) {
    const { dispatch, state, isBusy } = useContext(ScheduleContext)
    const { imageList, proofList, imageChanged, imageAction, proofAction, isBusy: imageBusy, preview, joined, reschedule, complete } = useStopEdit()

    if (!open) return <></>
    return (
        <>
            <Box pos='relative' className={open ? 'show' : 'hide'}>
                <LoadingOverlay visible={isBusy} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Group justify='space-around' align='baseline'><Title order={2} className='capitalize'>{state.joined?.donation?.type}</Title><Text>{`Stop: ${state.joined?.stopNumber}`}</Text></Group>
                <Group gap='sm' justify='center' grow>
                    <Button variant='outline' onClick={() => dispatch({ type: 'clearStop', payload: undefined })}>Back</Button>
                    <Button variant='outline' color='orange' onClick={() => dispatch({ type: 'reschedule', payload: undefined })}>Reschedule</Button>
                    <Button variant='outline' color='green' onClick={() => dispatch({ type: 'complete', payload: undefined })}>Complete</Button>
                </Group>
                <StopEditCard stopDetail={state.joined} />
                <ImageCarousel
                    mt='xs'
                    images={imageList}
                    disabled
                    callBack={(e: any) => {
                        imageAction(e)
                    }}
                    slideSize={{ base: '20%', sm: '20%' }}
                    align="start"
                    slideGap={{ base: 4, sm: 2 }}
                    withControls={false}
                    open={true}
                    hasChanged={imageChanged}
                />
                <ImageCarousel
                    mt='xs'
                    images={proofList}
                    callBack={(e: any) => {
                        proofAction(e)
                    }}
                    slideSize={{ base: '20%', sm: '20%' }}
                    align="start"
                    slideGap={{ base: 4, sm: 2 }}
                    withControls={false}
                    open={true}
                    hasChanged={imageChanged}
                />
                <Divider pb='xs' mt={2} />
                <ItemList />
                <Textarea value={state.joined?.donation?.driverNote} pt='xs' placeholder='Driver notes...'
                    onChange={(e) => dispatch({ type: 'driverNote', payload: e.currentTarget.value })}
                />
            </Box>
            <Modal opened={preview !== undefined} title='Image Viewer'
                onClose={() => {
                    imageAction({ cmd: 'CloseView', url: '', idx: 0, img: [] })
                    proofAction({ cmd: 'CloseView', url: '', idx: 0, img: [] })
                }}
            >
                <Image src={preview} fallbackSrc="https://hfhtdev.blob.core.windows.net/production/brokenImage.jpg" />
            </Modal>
        </>
    )
}
