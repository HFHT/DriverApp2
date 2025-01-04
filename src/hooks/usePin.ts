import { MainContext, ScheduleContext } from "@/contexts";
import { validatePin } from "@/services/validatePin";
import { theDate } from "@/utils";
import { useContext, useState } from "react";

export function usePin() {
    const [errorText, setErrorText] = useState('')
    const [isBusy, setIsBusy] = useState(false)
    const [pinValue, setPinValue] = useState<string | undefined>('')
    const [invalidPin, setInvalidPin] = useState(false)
    const { state, dispatch } = useContext(MainContext)
    const { dispatch: dispatchSched } = useContext(ScheduleContext)

    const validate = async (pinInput: string) => {
        console.log(pinInput, typeof pinInput)
        setIsBusy(true)
        setPinValue(pinInput)
        setErrorText('')
        let result: { err: boolean, error?: string | undefined, results: { valid: boolean, name: string | null }, settings: any, truckLocations: any } = await validatePin(pinInput, state!.date!)
        setIsBusy(false)
        if (result.err) {
            console.warn('usePin-validate-error', result.error)
            return
        }
        if (result.results.valid) {
            dispatch({ type: 'setPin', payload: pinInput })
            dispatch({ type: 'setSettings', payload: { ...result.settings } })
            dispatch({ type: 'setTrucks', payload: [...result.truckLocations] })
            dispatchSched({ type: 'set', payload: { ...result.results } })
            // setIsValid(true)
        } else {
            setPinValue('')
            setErrorText('Invalid Pin, please retry!')
            setInvalidPin(true)
        }
    }
    return { errorText, invalidPin, isBusy, validate, pinValue }
}
