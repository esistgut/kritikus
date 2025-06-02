import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface CompendiumHookResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  search: (term: string) => void;
  filter: (filters: Record<string, any>) => void;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export function useCompendiumData<T>(
  endpoint: string,
  initialLoad: boolean = true
): CompendiumHookResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const loadData = useCallback(async (page: number = 1, append: boolean = false, searchTermOverride?: string) => {
    setLoading(true);
    setError(null);

    try {
      const currentSearchTerm = searchTermOverride !== undefined ? searchTermOverride : searchTerm;
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '20',
        ...(currentSearchTerm && { search: currentSearchTerm }),
        ...filters,
      });

      const response = await axios.get<PaginatedResponse<T>>(`${endpoint}?${params}`);

      if (append) {
        setData(prev => [...prev, ...response.data.data]);
      } else {
        setData(response.data.data);
      }

      setCurrentPage(response.data.current_page);
      setHasMore(response.data.current_page < response.data.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, searchTerm, filters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadData(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, loadData]);

  const search = useCallback(async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setHasMore(true);
    setData([]); // Clear existing data

    // Trigger immediate search with the new term
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: '1',
        per_page: '20',
        ...(term && { search: term }),
        ...filters,
      });

      const response = await axios.get<PaginatedResponse<T>>(`${endpoint}?${params}`);
      setData(response.data.data);
      setCurrentPage(response.data.current_page);
      setHasMore(response.data.current_page < response.data.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, filters]);

  const filter = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    if (initialLoad) {
      loadData(1, false);
    }
  }, [initialLoad]); // Removed loadData from dependencies to prevent re-triggering

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    search,
    filter,
  };
}

export function useBasicCompendiumData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(endpoint);
        setData(response.data.races || response.data.classes || response.data.backgrounds || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [endpoint]);

  return { data, loading, error };
}

export function useSelectedCompendiumData<T>(
  endpoint: string,
  ids: number[],
  key: string
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setData([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(endpoint, { [`${key}_ids`]: ids });
        setData(response.data[key] || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [endpoint, ids, key]);

  return { data, loading, error };
}
