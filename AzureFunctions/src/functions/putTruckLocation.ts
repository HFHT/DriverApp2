import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
var MongoClient = require('mongodb').MongoClient;

export type RequestType = {
    _id: string
    gps: any
    ts: string
}
export async function putTruckLocation(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const req = await request.json() as RequestType
    const client = new MongoClient(process.env.ATLAS_URI)
    await client.connect()
    try {
        let results = await client.db('Scheduler').collection('TruckLocation').updateOne({ _id: req._id }, { $set: { ...req } }, { upsert: true })
        let data = await client.db('Scheduler').collection('TruckLocation').find().toArray()
        return {
            status: 200,
            body: JSON.stringify({ data: data, request: req, results: results })
        }
    } catch (error) {
        context.error(error)
        client.close()
        return { body: JSON.stringify({ err: true, error: error }), status: 501 }
    }
};

app.http('putTruckLocation', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: putTruckLocation
});
