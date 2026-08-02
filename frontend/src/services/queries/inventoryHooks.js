import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/services/api';

export const INVENTORYITEM_KEYS = {
  all: ['inventory'],
  lists: () => [...INVENTORYITEM_KEYS.all, 'list'],
  list: (filters) => [...INVENTORYITEM_KEYS.lists(), { filters }],
  details: () => [...INVENTORYITEM_KEYS.all, 'detail'],
  detail: (id) => [...INVENTORYITEM_KEYS.details(), id],
};

export const useInventoryItems = (filters = {}) => {
  return useQuery({
    queryKey: INVENTORYITEM_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/inventory', { params: filters });
      return data.data || data;
    },
  });
};

export const useInventoryItem = (id) => {
  return useQuery({
    queryKey: INVENTORYITEM_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/inventory/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/inventory', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INVENTORYITEM_KEYS.lists() }),
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/inventory/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORYITEM_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVENTORYITEM_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/inventory/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INVENTORYITEM_KEYS.lists() }),
  });
};
