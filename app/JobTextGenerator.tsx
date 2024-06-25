'use client';

import { useMemo, useState } from 'react';
import { useManualServerSentEvents } from './useManualServerSentEvents';

interface JobTextGeneratorProps {
  jobTitle: string;
  regenerate: boolean;
}

const JobTextGenerator: React.FC<JobTextGeneratorProps> = ({
  jobTitle,
  regenerate,
}) => {
  const [text, setText] = useState('');

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijp7ImlkIjoiNjYwODYyM2NiNjQxYTI1MTA2ODJiMjRlIiwiZW1haWwiOiJsYWdneWJlZXNAZW1haWwuY29tIiwicm9sZSI6IkNPTVBBTlkifSwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTcxOTMzNjQ4MSwiaWF0IjoxNzE5MzI5MjgxLCJqdGkiOiI1NzM5YmM1Zi1kNGY1LTRiODctYjE4YS1hNzNjNmJjMjMxODkifQ.yj7WKQilDJ-Gxi6ZBlEkwmLOOZEbON8kCsaKfsRYR8s';

  const method = 'GET';

  const url = !regenerate
    ? `http://127.0.0.1:8000/advertise/job/generate-text?scope=COMPANY_OVERVIEW&job_title=${jobTitle}`
    : `http://127.0.0.1:8000/advertise/job/rewrite-create-input-field?scope=COMPANY_OVERVIEW&job_title=${jobTitle}&text=${text}`;

  const { messages, startFetching, stopFetching } = useManualServerSentEvents(
    url,
    method,
    null,
    { Authorization: `Bearer ${token}` }
  );

  // Combine messages and replace '\n\n' with HTML line break '<br /><br />'
  const combinedMessages = useMemo(() => {
    return messages.join('').replace(/\n\n/g, '<br /><br />');
  }, [messages]);

  return (
    <div className="max-w-md mx-auto my-10 space-y-4">
      {regenerate && (
        <div>
          <textarea
            placeholder="text for regenerate"
            rows={5}
            cols={50}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}
      <button
        onClick={startFetching}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Start Streaming
      </button>
      <button
        onClick={stopFetching}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
      >
        Stop Streaming
      </button>
      <div
        className="mt-4 p-2 bg-gray-100 rounded shadow"
        dangerouslySetInnerHTML={{ __html: combinedMessages }}
      />
    </div>
  );
};

export default JobTextGenerator;
