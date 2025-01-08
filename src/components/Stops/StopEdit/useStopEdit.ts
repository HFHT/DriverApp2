import { imageStringToType, useImages } from "@/components/ImageCarousel";
import { ScheduleContext } from "@/contexts";
import { useContext, useEffect } from "react";

export function useStopEdit() {
    const { state, dispatch } = useContext(ScheduleContext)
    const { imageChanged, imageList, imageAction, imagePreview, setImageList, isBusy: isImageBusy } = useImages()
    const { imageChanged: proofChanged, imageList: proofList, imageAction: proofAction, imagePreview: proofPreview, setImageList: setProofList, isBusy: isProofBusy } = useImages((e) => { console.log('useStopEdit-callBack', e); dispatch({ type: 'proof', payload: { ...e } }) })

    useEffect(() => {
        if (!state.joined) return
        console.log('useStopEdit-useEffect-state', state)
        // setJoined(state.joined)
        setImageList([...imageStringToType(state.joined.donation?.delivery.imgs), ...imageStringToType(state.joined.donation?.pickup.imgs)])
        state.joined.donation?.proof && setProofList(imageStringToType(state.joined.donation.proof))
    }, [state.joined])

    const reset = () => {
        console.log('useStopEdit-reset',)
        setImageList([])
        setProofList([])
    }

    const isBusy = isImageBusy || isProofBusy
    const preview = imagePreview || proofPreview
    return { imageChanged, proofChanged, imageList, imageAction, isBusy, proofList, proofAction, preview, reset }
}
