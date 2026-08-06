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
      try {
        const res = await api.get('/admin/complaints', { params: filters });
        return res?.data || res || [];
      } catch (err) {
        const res = await api.get('/hostel/complaints', { params: filters }).catch(() => null);
        return res?.data || res || [];
      }
    },
  });
};

export const useComplaint = (id) => {
  return useQuery({
    queryKey: COMPLAINT_KEYS.detail(id),
    queryFn: async () => {
      const res = await api.get(`/admin/complaints/${id}`);
      return res?.data || res;
    },
    enabled: !!id,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const res = await api.post('/admin/complaints', newData);
      return res?.data || res;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPLAINT_KEYS.lists() }),
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const res = await api.patch(`/admin/complaints/${id}`, updateData);
      return res?.data || res;
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
      const res = await api.delete(`/admin/complaints/${id}`);
      return res?.data || res;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPLAINT_KEYS.lists() }),
  });
};

