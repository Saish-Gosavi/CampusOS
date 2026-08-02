import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const STUDENT_KEYS = {
  all: ['students'],
  lists: () => [...STUDENT_KEYS.all, 'list'],
  list: (filters) => [...STUDENT_KEYS.lists(), { filters }],
  details: () => [...STUDENT_KEYS.all, 'detail'],
  detail: (id) => [...STUDENT_KEYS.details(), id],
};

export const useStudents = (filters = {}) => {
  return useQuery({
    queryKey: STUDENT_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/students', { params: filters });
      return data.data || data;
    },
  });
};

export const useStudent = (id) => {
  return useQuery({
    queryKey: STUDENT_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/students/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData) => {
      const { data } = await api.post('/students', newData);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() }),
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/students/${id}`, updateData);
      return data.data || data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/students/${id}`);
      return data.data || data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.lists() }),
  });
};
