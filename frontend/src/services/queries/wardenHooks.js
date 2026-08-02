import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const WARDEN_KEYS = {
  all: ['wardens'],
  lists: () => [...WARDEN_KEYS.all, 'list'],
  list: (filters) => [...WARDEN_KEYS.lists(), { filters }],
  details: () => [...WARDEN_KEYS.all, 'detail'],
  detail: (id) => [...WARDEN_KEYS.details(), id],
};

export const useWardens = (filters = {}) => {
  return useQuery({
    queryKey: WARDEN_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/wardens', { params: filters });
      return data.data || data;
    },
  });
};

export const useWarden = (id) => {
  return useQuery({
    queryKey: WARDEN_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/wardens/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateWarden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/wardens', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WARDEN_KEYS.lists() }),
  });
};

export const useUpdateWarden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/wardens/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: WARDEN_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: WARDEN_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteWarden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/wardens/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WARDEN_KEYS.lists() }),
  });
};
