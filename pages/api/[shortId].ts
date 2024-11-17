import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shortId } = req.query;

  if (!shortId || typeof shortId !== 'string') {
    return res.status(400).json({ message: 'Invalid shortId' });
  }

  try {
    const db = await getDatabase('link_shortener');
    const link = await db.collection('links').findOne({ shortId });

    if (!link) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    res.redirect(301, link.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
