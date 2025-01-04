import { useState } from "react"
import { notifications } from '@mantine/notifications';
export type SendMessageType = {
    phone: string | undefined
    message: string | null
}
export function useTextMessage() {
    const [textMessage, setTextMessage] = useState<{ msgType: string | null, message: string | null }>({ msgType: '', message: '' })

    const sendMessage = async ({ phone, message }: SendMessageType) => {
        if (!phone || message === null) {
            console.warn('useTextMessage, missing phone number or message')
            return
        }
        try {
            console.log(phone, message)
            const link = document.createElement("a")
            phone = '+15209916545'
            link.href = `sms:+${phone}?body=${encodeURIComponent(message)}`
            link.click()
            link.remove()
            notifications.show({
                color: 'green',
                title: `Text sent.`,
                message: `Text to ${phone} was sent.`,
            })
        }
        catch (e) {
            notifications.show({
                color: 'red',
                title: `Text failed.`,
                message: `Text to ${phone} was not sent!`,
            })
            console.log('sendText-catch-error', e)
        }
    }
    const clearMessage = () => {
        setTextMessage({ msgType: '', message: '' })
    }
    return { textMessage, setTextMessage, sendMessage, clearMessage }
}
