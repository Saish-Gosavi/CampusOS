import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/services/api';

export const COMPLAINT_KEYS = {
  all: ['complaints'],
  lists: () => [...COMPLAINT_KEYS.all, 'list'],
  list: (filters) => [...COMPLAINT_KEYS.lists(), { filters }],
  details: () => [...COMPLAINT_KEYS.all, 'detail'],
  detail: (id) => [...COMPLAINT_KEYS.details(), id],
};

export const useComplaints = (filters = {}) => {
  return useQuery({
    queryKey: COMPLAINT_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/complaints', { params: filters });
      return data.data || data;
    },
  });
};

export const useComplaint = (id) => {
  return useQuery({
    queryKey: COMPLAINT_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/complaints/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/complaints', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPLAINT_KEYS.lists() }),
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/complaints/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPLAINT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COMPLAINT_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/complaints/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPLAINT_KEYS.lists() }),
  });
};
