import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
export const theDate = (dateString?: string | undefined) => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    const t = dayjs.tz(dateString, 'America/Toronto')
    return t.format('YYYY-MM-DD')
}

