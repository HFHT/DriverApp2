import { ScheduleContext } from "@/contexts"
import { StopDetailJoined } from "@/contexts/ScheduleContext/useGetApptsforDay"
import { uniqueKey } from "@/utils"
import { Button, Checkbox, Grid, NumberInput, Text, Textarea, TextInput, Tooltip } from "@mantine/core"
import { IconCirclePlus } from "@tabler/icons-react"
import { useContext, useEffect, useState } from "react"

export function ItemList() {
    const { state, dispatch } = useContext(ScheduleContext)

    const [newItem, setNewItem] = useState<{ qty: number, prod: string }>({ qty: 1, prod: '' })
    useEffect(() => {
        console.log('ItemList-useEffect', state.joined)
        setNewItem({ qty: 1, prod: '' })
    }, [state.joined])

    if (!state || !state.joined || !state.joined.donation) return <></>
    const items = () => (
        [...state.joined!.donation!.delivery.items, ...state.joined!.donation!.pickup.items].map((si, idx) => (
            <Grid gutter='xs' key={uniqueKey()}>
                <Grid.Col span={1} pt={3} pb={3}>
                    <Text size='sm'>{si.qty}</Text>
                </Grid.Col>
                <Grid.Col span={9} pt={3} pb={3}>
                    <Text size='sm'>{si.prod}</Text>
                </Grid.Col>
                <Grid.Col span={2} pt={3} pb={3}>
                    <Checkbox radius='sm' checked={si.c} onChange={(e) => dispatch({ type: 'itemComplete', payload: { idx: idx, checked: e.currentTarget.checked } })} />
                </Grid.Col>
            </Grid>
        ))
    )
    return (
        <>
            {items()}
            <Grid gutter='xs' mt='xs'>
                <Grid.Col span={2} pt={0} pb={0}>
                    <NumberInput value={newItem.qty?.toString()} size='xs' placeholder='Qty' hideControls onChange={(e) => setNewItem({ ...newItem, qty: Number(e) })} />
                </Grid.Col>
                <Grid.Col span={8} pt={0} pb={0}>
                    <Textarea value={newItem.prod} size='xs' rows={1} autosize placeholder='Addition pickup item...' onChange={(e) => setNewItem({ ...newItem, prod: e.currentTarget.value })} />
                </Grid.Col>
                <Grid.Col span={2} pt={0} pb={0}>
                    <Tooltip label='Add pickup.'>
                        <Button variant='subtle' disabled={newItem.qty === 0 || newItem.prod.length < 3}
                            leftSection={<IconCirclePlus />}
                            onClick={() => {
                                dispatch({ type: 'addItem', payload: { qty: newItem.qty, prod: newItem.prod, c: true } })
                            }}
                        >
                        </Button>
                    </Tooltip>
                </Grid.Col>
            </Grid>
        </>
    )
}
