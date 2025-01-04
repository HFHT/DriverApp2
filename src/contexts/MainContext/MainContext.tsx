import { theDate } from "@/utils";
import { createContext, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useReducer, useState } from "react";
import { useMain } from "..";
export const MainContext = createContext<MainContexType>({
    state: {
        pin: undefined,
        date: theDate(),
        online: true,
        route: 'Blue',
        truckLocations: [],
        view: 'Schedule',
        stopDetail: undefined,
        settings: undefined
    },
    sasToken: undefined,
    dispatch: () => { },
    scrollPosition: { x: 0, y: 0 },
    onScrollPositionChange: () => { },
})

export const MainContextProvider = (props: MainContextProviderType) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { sasToken } = useMain()
    const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 })


    function reducer(state: MainContextStateType, action: { type: MainContextActions, payload: any }) {
        console.log(action)
        switch (action.type) {
            case 'reset': return { ...initialState, pin: state.pin }
            case 'setDate': return { ...state, date: action.payload }
            case 'setOnline': return { ...state, online: action.payload }
            case 'setPin': return { ...state, pin: action.payload }
            case 'setRoute': return { ...state, route: action.payload }
            case 'setTrucks': return { ...state, truckLocations: action.payload }
            case 'setView': return { ...state, view: action.payload }
            case 'setSettings': return { ...state, settings: action.payload }
            default: { console.log('default'); return state }
        }
    }
    return (
        <MainContext.Provider value={{
            state: state,
            dispatch: dispatch,
            sasToken: sasToken,
            scrollPosition: scrollPosition,
            onScrollPositionChange: onScrollPositionChange
        }}>
            {props.children}
        </MainContext.Provider>
    )
}

const initialState: MainContextStateType = {
    date: theDate(),
    pin: undefined,
    online: true,
    route: 'Blue',
    truckLocations: [],
    view: 'Schedule',
    // editMode: false,
    stopDetail: undefined,
    settings: undefined
}

export type MainContextProviderType = {
    children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined,
    props: any
}

export type MainContextStateType = {
    date: string | undefined
    pin: number | string | undefined
    online: boolean
    route: string,
    truckLocations: any[]
    view: 'Schedule' | 'Map',
    // editMode: boolean
    stopDetail: any,
    settings: SettingsType | undefined
}
export type SasTokenType = {
    sasKey: string
    url: string
}
export type MainContexType = {
    state: MainContextStateType,
    dispatch: Function,
    sasToken: SasTokenType | undefined,
    scrollPosition: { x: number, y: number },
    onScrollPositionChange: Function,
}

export type MainContextActions = 'reset' | 'setDate' | 'setOnline' | 'setPin' | 'setRoute' | 'setTrucks' | 'setView' | 'setEditMode' | 'setSchedDate' | 'setSettings'

export type SettingsType = {
    site: SiteSettingsType | undefined
    trucks: any | undefined
}

export type SiteSettingsType = {
    StartDate: string
    locations: SiteLocationType[]
    mapCenter: { lat: number, lng: number }
    truckRefreshRate: number
    schedRefreshRate: number
}

export type SiteLocationType = {
    address: string
    mapLocation: { lat: number, lng: number }
    name: string
}