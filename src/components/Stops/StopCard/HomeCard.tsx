import { Card, Grid, Text } from "@mantine/core";
import { IconArrowBack, IconMapPin } from "@tabler/icons-react";
const CONST_HOME_STOP =
{
    "company": "HabiStore",
    "phone": "15208897200",
    "email": "habistore@habitattucson.org",
    "zip": "85705",
    "lat": 32.2497787,
    "lng": -110.9870814,
    "addr": "935 West Grant Road",
    "city": "Tucson",
}
export function HomeCard() {
    return (
        <>
            <Card withBorder onClick={() => console.log('click')}>
                <Grid m={0} p={0} gutter={0} >
                    <Grid.Col span={6}>
                        <Text size='sm'></Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Text size='sm'></Text>
                    </Grid.Col>
                    <Grid.Col span={2}><IconArrowBack /></Grid.Col>
                    <Grid.Col span={10}><Text size='sm'>HabiStore</Text></Grid.Col>
                    <Grid.Col span={2}></Grid.Col>
                    <Grid.Col span={12}><Text size='sm'>935 West Grant Road</Text></Grid.Col>
                    <Grid.Col span={6}><Text size='sm'>Tucson</Text></Grid.Col>
                    <Grid.Col span={4}><Text size='sm'>85705</Text></Grid.Col>
                    <Grid.Col span={2}><a title='HabiStore Map' className='maplink' href={`http://maps.google.com/?q=${CONST_HOME_STOP.lat},${CONST_HOME_STOP.lng}`}><IconMapPin /></a></Grid.Col>
                </Grid>
            </Card>
        </>
    )
}
