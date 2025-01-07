import { imageStringToType, useImages } from "@/components/ImageCarousel";
import { ScheduleContext } from "@/contexts";
import { StopDetailJoined } from "@/contexts/ScheduleContext/useGetApptsforDay";
import { useContext, useEffect, useState } from "react";

export function useStopEdit() {
    const { state, dispatch } = useContext(ScheduleContext)
    const { imageChanged, imageList, imageAction, imagePreview, setImageList, isBusy: isImageBusy } = useImages()
    const { imageChanged: proofChanged, imageList: proofList, imageAction: proofAction, imagePreview: proofPreview, setImageList: setProofList, isBusy: isProofBusy } = useImages((e) => { console.log('useStopEdit-callBack', e); dispatch({ type: 'proof', payload: { ...e } }) })
    const [joined, setJoined] = useState<StopDetailJoined | undefined>(undefined)
    const [allImages, setAllImages] = useState([])
    const [proofImages, setProofImages] = useState([])

    useEffect(() => {
        if (!state.joined) return
        console.log('useStopEdit-useEffect-state', state)
        setJoined(state.joined)
        setImageList([...imageStringToType(state.joined.donation?.delivery.imgs), ...imageStringToType(state.joined.donation?.pickup.imgs)])
        state.joined.donation?.proof && setProofList(imageStringToType(state.joined.donation.proof))
    }, [state.joined])

    const reschedule = () => {
        dispatch({ type: 'reschedule', payload: { ...joined } })
    }

    const complete = () => {
        dispatch({ type: 'complete', payload: { ...joined } })

    }

    const isBusy = isImageBusy || isProofBusy
    const preview = imagePreview || proofPreview
    return { allImages, proofImages, imageChanged, imageList, imageAction, isBusy, proofList, proofAction, setProofImages, preview, joined, reschedule, complete }
}
