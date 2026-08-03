import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/services/api';

export const ROOM_KEYS = {
  all: ['rooms'],
  lists: () => [...ROOM_KEYS.all, 'list'],
  list: (filters) => [...ROOM_KEYS.lists(), { filters }],
  details: () => [...ROOM_KEYS.all, 'detail'],
  detail: (id) => [...ROOM_KEYS.details(), id],
};

export const useRooms = (filters = {}) => {
  return useQuery({
    queryKey: ROOM_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/rooms', { params: filters });
      return data.data || data;
    },
  });
};

export const useRoom = (id) => {
  return useQuery({
    queryKey: ROOM_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/rooms/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/rooms', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() }),
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/rooms/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ROOM_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/rooms/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROOM_KEYS.lists() }),
  });
};
