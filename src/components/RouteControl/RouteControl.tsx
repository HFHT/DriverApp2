import { MainContext } from "@/contexts";
import { SegmentedControl } from "@mantine/core";
import { useContext } from "react";
interface RouteControlInterface {
  open: boolean
}
export function RouteControl({open}:RouteControlInterface) {
  const { state, dispatch } = useContext(MainContext)
  if (!open || !state || state.date === undefined) return <></>

  return (
    <SegmentedControl value={state.route} data={['Blue', 'Red', '3rd', 'Corporate']}  onChange={(e) => dispatch({ type: 'setRoute', payload: e })}/>
  )
}
