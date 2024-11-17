import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/mongodb';
import { nanoid } from 'nanoid';

interface ShortenResponse {
  message: string;
  shortUrl?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ShortenResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { originalUrl } = req.body;

  if (!originalUrl || !/^https?:\/\/.+/i.test(originalUrl)) {
    return res.status(400).json({ message: 'Invalid URL format', error: 'Invalid Input' });
  }

  try {
    const db = await getDatabase('link_shortener');
    const shortId = nanoid(8);

    const existing = await db.collection('links').findOne({ originalUrl });
    if (existing) {
      return res.status(200).json({
        message: 'Short URL already exists',
        shortUrl: `${process.env.BASE_URL}/api/${existing.shortId}`,
      });
    }

    await db.collection('links').insertOne({
      originalUrl,
      shortId,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: 'Short URL created',
      shortUrl: `${process.env.BASE_URL}/api/${shortId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: (error as Error).message });
  }
}
