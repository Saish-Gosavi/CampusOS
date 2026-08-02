import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const LIBRARYBOOK_KEYS = {
  all: ['library/books'],
  lists: () => [...LIBRARYBOOK_KEYS.all, 'list'],
  list: (filters) => [...LIBRARYBOOK_KEYS.lists(), { filters }],
  details: () => [...LIBRARYBOOK_KEYS.all, 'detail'],
  detail: (id) => [...LIBRARYBOOK_KEYS.details(), id],
};

export const useLibraryBooks = (filters = {}) => {
  return useQuery({
    queryKey: LIBRARYBOOK_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/library/books', { params: filters });
      return data.data || data;
    },
  });
};

export const useLibraryBook = (id) => {
  return useQuery({
    queryKey: LIBRARYBOOK_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/library/books/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateLibraryBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/library/books', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LIBRARYBOOK_KEYS.lists() }),
  });
};

export const useUpdateLibraryBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/library/books/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: LIBRARYBOOK_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: LIBRARYBOOK_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteLibraryBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/library/books/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LIBRARYBOOK_KEYS.lists() }),
  });
};
