import { useEffect, useState } from 'react';
import { parseConfiguratorXml } from '../utils/xmlParser.js';

const xmlUrl = new URL('../../data/configurator.xml', import.meta.url).href;

export function useXmlData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadXml() {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(xmlUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`XML не загрузился: ${response.status}`);
        }

        const xmlString = await response.text();
        setData(parseConfiguratorXml(xmlString));
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Не удалось прочитать XML');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadXml();

    return () => controller.abort();
  }, []);

  return { data, error, isLoading };
}
