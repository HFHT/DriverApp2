// NOT USED

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { fetchApptsForDay, queryGet } from "../utils";
var MongoClient = require('mongodb').MongoClient;
//
// Receives a date and returns the associated ScheduleDates and ScheduleAppts
// Returns undefined ScheduleDates if date doesn't exist
// Returns empty ScheduleAppts if there are no stops for the date
//
// Also returns appts, donors, donations
// }

export async function getApptsForDay(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const theDate = request.query.get('date')

    const client = new MongoClient(process.env.ATLAS_URI)
    await client.connect()
    try {
        let retVal = {}
        if (theDate) {
            retVal = await fetchApptsForDay(theDate, client, context)
        }
        await client.close()
        return {
            status: 200,
            body: JSON.stringify({ ...retVal })
        }
    } catch (error) {
        context.error(error)
        await client.close()
        return { body: JSON.stringify({ err: true, error: error }), status: 310 }
    }
};

export type ScheduleDatesType = {
    _id: string
    archive: boolean
    block: string[]
    waitlist: string[]
    stops: ScheduleStopsType[]
    cancelled: ScheduleStopsType[] | undefined
}
export type ScheduleStopsType = {
    a_id: number
    d_id: number
    route: string
    size: number
    order: number
    slot?: number
    _id?: string | undefined
    source: 'scheduler' | 'web' | 'online'
    type: 'pickup' | 'delivery'
    status: {
        code: 'order' | 'status' | 'size' | 'block' | 'archive' | 'completed' | 'calls' | 'move' | 'cancel'
        date: string | Date
        by: string
    }
}
app.http('getApptsForDay', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getApptsForDay
});