import { Box, Flex, LoadingOverlay, PinInput, Text } from "@mantine/core"
import { usePin } from "@/hooks";
import { useRef } from "react";

interface GetPinType {
    open: boolean
}
export function GetPin({ open }: GetPinType) {
    const { errorText, invalidPin, isBusy, validate, pinValue } = usePin()
    const pinRef = useRef<HTMLInputElement>(null)
    if (!open) return <></>
    return (
        <Box pos='relative'>
            <LoadingOverlay visible={isBusy} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Flex direction='column' justify='space-around' align='center'>
                <Text size='xl'>Enter Pin</Text>
                <PinInput ref={pinRef} value={pinValue} autoFocus error={invalidPin} type="number" onComplete={
                    (e) => {
                        validate(e);
                        pinRef.current?.focus();
                    }}
                />
                <Text mt='lg'>{errorText}</Text>
            </Flex>
        </Box>
    )
}
