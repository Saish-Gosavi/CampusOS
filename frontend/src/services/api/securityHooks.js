import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const SECURITYLOG_KEYS = {
  all: ['security/logs'],
  lists: () => [...SECURITYLOG_KEYS.all, 'list'],
  list: (filters) => [...SECURITYLOG_KEYS.lists(), { filters }],
  details: () => [...SECURITYLOG_KEYS.all, 'detail'],
  detail: (id) => [...SECURITYLOG_KEYS.details(), id],
};

export const useSecurityLogs = (filters = {}) => {
  return useQuery({
    queryKey: SECURITYLOG_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/security/logs', { params: filters });
      return data.data || data;
    },
  });
};

export const useSecurityLog = (id) => {
  return useQuery({
    queryKey: SECURITYLOG_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/security/logs/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateSecurityLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/security/logs', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SECURITYLOG_KEYS.lists() }),
  });
};

export const useUpdateSecurityLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/security/logs/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: SECURITYLOG_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SECURITYLOG_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteSecurityLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/security/logs/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SECURITYLOG_KEYS.lists() }),
  });
};
