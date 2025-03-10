import { fetchJson } from "."
export async function getApptsforDay( theDate: string) {
    const header: any = { method: "GET", headers: new Headers() }
    return await fetchJson(`${import.meta.env.VITE_DRIVER_URL}getApptsForDay?date=${theDate}`, header)
}
