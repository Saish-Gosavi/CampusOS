import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/services/api';

// --- QUERY KEYS ---
export const HOSTEL_KEYS = {
  all: ['hostel/hostels'],
  lists: () => [...HOSTEL_KEYS.all, 'list'],
  list: (filters) => [...HOSTEL_KEYS.lists(), { filters }],
  details: () => [...HOSTEL_KEYS.all, 'detail'],
  detail: (id) => [...HOSTEL_KEYS.details(), id],
  stats: () => [...HOSTEL_KEYS.all, 'stats'],
};

// --- HOOKS ---

// Fetch all hostels
export const useHostels = (filters = {}) => {
  return useQuery({
    queryKey: HOSTEL_KEYS.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/hostel/hostels', { params: filters });
      return data; // Assuming your API returns { status: "success", data: [...] }
    },
  });
};

// Fetch a single hostel
export const useHostel = (id) => {
  return useQuery({
    queryKey: HOSTEL_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/hostel/hostels/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create a hostel
export const useCreateHostel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newHostel) => {
      const { data } = await api.post('/hostel/hostels', newHostel);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: HOSTEL_KEYS.lists() });
    },
  });
};

// Update a hostel
export const useUpdateHostel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.patch(`/hostel/hostels/${id}`, updateData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: HOSTEL_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: HOSTEL_KEYS.detail(variables.id) });
    },
  });
};

// Delete a hostel
export const useDeleteHostel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/hostel/hostels/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HOSTEL_KEYS.lists() });
    },
  });
};
