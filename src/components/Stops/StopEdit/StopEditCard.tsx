import { useTextMessage } from "@/components";
import { StopDetailJoined } from "@/contexts/ScheduleContext/useGetApptsforDay";
import { Button, Card, Grid, Group, Modal, Select, Stack, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDeviceMobileMessage, IconMapPin, IconPhoneOutgoing } from "@tabler/icons-react";

interface StopEditCardInterface {
    stopDetail: StopDetailJoined | undefined
}
export function StopEditCard({ stopDetail }: StopEditCardInterface) {
    const [opened, { open, close }] = useDisclosure(false)
    const { textMessage, setTextMessage, sendMessage, clearMessage } = useTextMessage()
    const textMsgs = [
        { label: '10 min', value: 'This is the Habistore. We are approximately 10 minutes away from your pickup location. Please call or text with any questions or special instructions.' },
        { label: 'At pickup location', value: 'This is the Habistore. We are at the pickup location and have been unable to make contact with you. Please call or text within 5 minutes, otherwise our drivers will have to move on and we will contact you about rescheduling.' },
        { label: 'Cannot accept', value: 'This is the Habistore. Unfortunately, we cannot accept one/multiple of your items. If you have any questions or concerns please contact us at 520-889-7200.' },
    ]

    if (!stopDetail || !stopDetail.donor || !stopDetail.donation) return <Text>Error accessing the stop detail.</Text>
    return (
        <>
            <Card withBorder mt={'sm'}>
                <Grid m={0} p={0} gutter={0} >
                    <Grid.Col span={6} pb={4}>
                        <Text size='sm'>{`${stopDetail.donor.name.first} ${stopDetail.donor.name.last}`}</Text>
                    </Grid.Col>
                    <Grid.Col span={5} pb={4}>
                        <Text size='sm'>{stopDetail.donor.phone || stopDetail.donor._id}</Text>
                    </Grid.Col>
                    <Grid.Col span={1} pb={4}>
                        <a title='place call' href={`tel:${stopDetail.donor.phone}`}>
                            <IconPhoneOutgoing className='a_link'/>
                        </a>
                    </Grid.Col>
                    <Grid.Col span={11}><Text size='sm'>{stopDetail.donor.name.company}</Text></Grid.Col>
                    <Grid.Col span={1}><IconDeviceMobileMessage className='a_link' onClick={() => open()} /></Grid.Col>
                    <Grid.Col span={12}><Text size='sm'>{`${stopDetail.donor.place.num} ${stopDetail.donor.place.route} `}<b><i>{stopDetail.donor.place.address2}</i></b></Text></Grid.Col>
                    <Grid.Col span={6}><Text size='sm'>{stopDetail.donor.place.city}</Text></Grid.Col>
                    <Grid.Col span={5}><Text size='sm'>{stopDetail.donor.place.zip}</Text></Grid.Col>
                    <Grid.Col span={1}>
                        <a title='Google Map Link' className='maplink' href={`http://maps.google.com/?q=${stopDetail.donor.place.lat},${stopDetail.donor.place.lng}`}>
                            <IconMapPin className='a_link'/>
                        </a>
                    </Grid.Col>
                    <Grid.Col span={12}><Text size='sm'>{stopDetail.donation.driverNote}</Text></Grid.Col>
                </Grid>
            </Card>
            <Modal opened={opened} onClose={close} title='Send Text Message'  >
                <Stack>
                    <Select data={textMsgs} placeholder='Select Message Type' onChange={(e) => e !== null && setTextMessage({ ...textMessage, message: e })} />
                    <Textarea autosize minRows={8} placeholder='Message...' value={textMessage.message!} onChange={(e) => setTextMessage({ ...textMessage, message: e.currentTarget.value })} />
                    <Group grow justify='center'>
                        <Button disabled={!opened} onClick={() => { clearMessage(); close() }}>Back</Button>
                        <Button disabled={textMessage.message === ''} onClick={() => {
                            close()
                            sendMessage({ phone: stopDetail.donor!.phone || stopDetail.donor!._id, message: textMessage.message })
                            clearMessage()
                        }
                        }>Send Text</Button>
                    </Group>
                </Stack>
            </Modal>
        </>)
}
