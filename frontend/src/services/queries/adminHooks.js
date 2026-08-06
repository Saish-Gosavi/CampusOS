import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/services/api';

export const ADMIN_KEYS = {
  all: ['admins'],
  lists: () => [...ADMIN_KEYS.all, 'list'],
  list: (filters) => [...ADMIN_KEYS.lists(), { filters }],
  details: () => [...ADMIN_KEYS.all, 'detail'],
  detail: (id) => [...ADMIN_KEYS.details(), id],
};

export const useAdmins = (filters = {}) => {
  return useQuery({
    queryKey: ADMIN_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/admins', { params: filters });
      return data.data || data;
    },
  });
};

export const useAdmin = (id) => {
  return useQuery({
    queryKey: ADMIN_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/admins/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/admins', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.lists() }),
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/admins/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/admins/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.lists() }),
  });
};
