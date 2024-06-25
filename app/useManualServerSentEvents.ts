import { useCallback, useEffect, useState } from 'react';

export const useManualServerSentEvents = (
  url: string,
  method: string,
  body?: any,
  headers?: HeadersInit
) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [controller, setController] = useState<AbortController | null>(null);

  const startFetching = useCallback(() => {
    const newController = new AbortController();
    setController(newController);
    const signal = newController.signal;

    const fetchConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal,
    };
    if (method !== 'GET') {
      fetchConfig.body = JSON.stringify(body);
    }

    const fetchData = async () => {
      try {
        console.log({ fetchConfig, headers });
        const response = await fetch(url, fetchConfig);

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            const str = decoder.decode(value);

            try {
              // Adjusting for SSE format by stripping 'data: ' prefix and trimming any remaining whitespace
              const jsonStr = str.replace(/^data: /, '').trim();
              const newMessage = JSON.parse(jsonStr);
              console.log(newMessage);
              setMessages((prevMessages) => [...prevMessages, newMessage.text]);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchData();
  }, [url, method, body, headers]);

  const stopFetching = useCallback(() => {
    if (controller) {
      controller.abort();
      setController(null);
    }
  }, [controller]);

  // cleaning up on component unmount
  useEffect(() => {
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [controller]);

  return { messages, startFetching, stopFetching };
};
