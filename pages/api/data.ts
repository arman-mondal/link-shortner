import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/mongodb';

type Data = {
  message: string;
  data?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const dbName = 'link-shortener';
  const collectionName = 'links';

  try {
    const db = await getDatabase(dbName);

    switch (req.method) {
      case 'GET': {
        const data = await db.collection(collectionName).find({}).toArray();
        res.status(200).json({ message: 'Success', data });
        break;
      }
      case 'POST': {
        const newData = req.body;
        const result = await db.collection(collectionName).insertOne(newData);
        const insertedData = await db.collection(collectionName).findOne({ _id: result.insertedId });
        if (insertedData) {
          res.status(201).json({ message: 'Data inserted', data: insertedData });
        } else {
          res.status(500).json({ message: 'Failed to retrieve inserted data' });
        }
        break;
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
