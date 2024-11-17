import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const shortenUrl = async () => {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: url }),
    });
    const data = await response.json();
    if (data.shortUrl) setShortUrl(data.shortUrl);
  };

  return (
    // <div>
    //   <h1>Link Shortener</h1>
    //   <input
    //     type="url"
    //     placeholder="Enter URL"
    //     value={url}
    //     onChange={(e) => setUrl(e.target.value)}
    //   />
    //   <button onClick={shortenUrl}>Shorten</button>
    //   {shortUrl && (
    //     <p>
    //       Short URL: <a href={shortUrl} target="_blank">{shortUrl}</a>
    //     </p>
    //   )}
    // </div>
    <>
    <div className='w-full h-screen'>
      <div className='flex justify-center items-center h-full'>
        <div className='w-96'>
          <h1 className='text-4xl font-bold mb-4'>Link Shortener</h1>
          <input
            type='url'
            placeholder='Enter URL'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className='w-full p-2 mb-4 text-black'
          />
          <button onClick={shortenUrl} className='w-full p-2 bg-blue-500 text-white rounded'>
            Shorten
          </button>
          {shortUrl && (
            <p className='mt-4'>
              Short URL: <a href={shortUrl} target='_blank' className='text-blue-500'>{shortUrl}</a>
            </p>
          )}
        </div>
      </div>
    </div>
    
    </>
  );
}
