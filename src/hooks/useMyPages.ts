import { useState, useEffect } from 'react';

interface StoredPage {
  username: string;
  token: string;
}

const STORAGE_KEY = 'linkforge_my_pages';

export function useMyPages() {
  const [pages, setPages] = useState<StoredPage[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    try {
      // Migrate old single-token format
      const all: StoredPage[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('linkforge_token_')) {
          const username = key.replace('linkforge_token_', '');
          const token = localStorage.getItem(key) || '';
          if (username && token) all.push({ username, token });
        }
      }
      setPages(all);
    } catch {
      setPages([]);
    }
  };

  const addPage = (username: string, token: string) => {
    localStorage.setItem(`linkforge_token_${username}`, token);
    load();
  };

  return { pages, addPage, reload: load };
}
