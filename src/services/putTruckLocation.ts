import { fetchJson } from "."

export async function putTruckLocation(props: any) {
    const options = {
        method: "PUT",
        headers: new Headers(),
        body: JSON.stringify(props)
    }
    return await fetchJson(`${import.meta.env.VITE_DRIVER_URL}putTruckLocation`, options)

}
