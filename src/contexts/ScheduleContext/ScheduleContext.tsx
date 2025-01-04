import { createContext, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useContext, useEffect, useReducer } from 'react';
import { SchedAndApptsType, SchedulerApptType, SchedulerDonationType, SchedulerDonorType, StopDetailJoined, useGetApptsforDay } from './useGetApptsforDay';
import { SchedulerStopType } from "@/contexts/ScheduleContext/useGetApptsforDay";
import { putAppt } from '@/services';
import { MainContext } from '../MainContext/MainContext';

const initialState: SchedAndApptsType = {
    schedDate: undefined,
    appts: [],
    donors: [],
    donations: [],
    joined: undefined
}
export const ScheduleContext = createContext<ScheduleContextType>({
    state: initialState,
    dispatch: () => { },
    fetchSchedule: () => { },
    joinStopDetail: () => { },
    isBusy: false
});
export type ContextProviderType = {
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined,
    props: any
}
export const ScheduleContextProvider = (props: any) => {
    const { state: mainState } = useContext(MainContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [both, fetchMongo, isBusy] = useGetApptsforDay()
    useEffect(() => {
        // console.log('ScheduleContextProvider-useEffect-both')
        dispatch({ type: 'set', payload: both })            //Set the reducer state when schedule changes
    }, [both])

    const joinStopDetail = (stopDetail: SchedulerStopType | undefined): StopDetailJoined | undefined => {
        if (!stopDetail) return undefined
        let theAppt = state.appts.find((af) => af._id === stopDetail.a_id)
        // if (!theAppt) { console.warn('StopCard appointment not found', stopDetail, state.appts); return }
        let theDonor = state.donors.find((df) => df._id == theAppt?._donorKey)
        let theDonation = state.donations.find((df) => df._id === stopDetail.d_id)
        // if (!theDonor || !theDonation) { console.warn('StopCard donor or donation not found', stopDetail, state.donors, state.donations); return }
        return { appt: theAppt, donor: theDonor, donation: theDonation }
    }
    return (
        <ScheduleContext.Provider value={{
            state: state,
            dispatch: dispatch,
            fetchSchedule: fetchMongo,
            joinStopDetail: joinStopDetail,
            isBusy: isBusy
        }}>
            {props.children}
        </ScheduleContext.Provider>
    )

    function reducer(state: SchedAndApptsType, action: ScheduleContextStateActionType): SchedAndApptsType {
        console.log(action, state)
        const proofImage = () => {
            return { cmd: 'NOOP', jsonValue: {} }
        }
        switch (action.type) {
            case "reset": return { ...initialState }
            case "set": return { ...state, ...action.payload }
            case "setStop": {
                const stopDetail = { ...action.payload }
                let theAppt = state.appts.find((af) => af._id === stopDetail.a_id)
                let theDonor = state.donors.find((df) => df._id == theAppt?._donorKey)
                let theDonation = state.donations.find((df) => df._id === stopDetail.d_id)
                return { ...state, joined: { appt: theAppt, donor: theDonor, donation: theDonation, stopNumber: stopDetail.stopNumber } }
            }
            case "clearStop": return { ...state, joined: undefined }
            case "addItem": {
                if (!state.joined || !state.joined.donation) {
                    console.warn('Schedule-Context-addItem state.joined is undefined')
                    return state
                }
                let theDonation = state.joined.donation
                if (theDonation.type === 'pickup') {
                    theDonation.pickup.items.push(action.payload)
                } else {
                    theDonation.delivery.items.push(action.payload)
                }
                return { ...state, joined: { ...state.joined, donation: theDonation } }
            }
            case 'itemComplete': {
                if (!state.joined || !state.joined.donation) {
                    console.warn('Schedule-Context-addItem state.joined is undefined')
                    return state
                }
                let theDonation = state.joined.donation
                if (theDonation.type === 'pickup') {
                    theDonation.pickup.items[action.payload.idx].c = action.payload.checked
                } else {
                    theDonation.delivery.items[action.payload.idx].c = action.payload.checked
                }
                return { ...state, joined: { ...state.joined, donation: theDonation } }
            }
            case "driverNote": {
                if (!state.joined || !state.joined.donation) {
                    console.warn('Schedule-Context-addItem state.joined is undefined')
                    return state
                }
                let theDonation = state.joined.donation
                theDonation.driverNote = action.payload
                return { ...state, joined: { ...state.joined, donation: theDonation } }
            }
            case "reschedule": {
                console.log(state.joined)
                if (!state.joined || !state.joined.donation || !state.joined.appt) {
                    console.warn('Schedule-Context-reschedule state.joined is undefined')
                    return state
                }
                putAppt({
                    _id: mainState.date,
                    cmds: [
                        {
                            cmd: 'reschedule',
                            jsonValue: {
                                _id: '2024-12-02', d_id: state.joined.appt.donationId, status: { code: 'resched', date: '2024-12-02', by: 'driver' }
                            }
                        },
                        { cmd: 'driverNote', jsonValue: { _id: state.joined.donation._id, driverNote: state.joined.donation.driverNote } }
                    ]
                })
                return state
            }
            case "complete": {
                console.log(state.joined)
                if (!state.joined || !state.joined.donation || !state.joined.appt) {
                    console.warn('Schedule-Context-complete state.joined is undefined')
                    return state
                }
                putAppt({
                    _id: mainState.date,
                    cmds: [
                        {
                            cmd: 'complete',
                            jsonValue: {
                                _id: '2024-12-02', d_id: state.joined.appt.donationId, status: { code: 'completed', date: '2024-12-02', by: 'driver' }
                            }
                        },
                        {
                            cmd: 'items', jsonValue: {
                                _id: state.joined.donation._id, delivery: state.joined.donation.delivery.items, pickup: state.joined.donation.pickup.items
                            }
                        },
                        { cmd: 'driverNote', jsonValue: { _id: state.joined.donation._id, driverNote: state.joined.donation.driverNote } }
                    ]
                })
                return state
            }
            default: return state
        }
    }
}

export type ScheduleContextStateActionType = {
    payload: any
    type: 'reset' | 'set' | 'addItem' | 'itemComplete' | 'driverNote' | 'setStop' | 'clearStop' | 'complete' | 'reschedule' | 'fetch' | 'updateDonor' | 'updateDonation' | 'updateImages' | 'fetchBoth' | 'cancel' | 'move' | 'update' | 'setRouteSlot' | 'saveSched' | 'saveAppt' | 'saveDonation' | 'address' | 'updateRoute' | 'reverse' | 'block' | 'print'
}

export type ScheduleContextType = {
    state: SchedAndApptsType,
    dispatch: Function,
    fetchSchedule: Function,
    joinStopDetail: Function,
    isBusy: boolean
}
