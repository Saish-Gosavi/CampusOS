import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

export const DASHBOARD_KEYS = {
  all: ['dashboard'],
  superAdmin: () => [...DASHBOARD_KEYS.all, 'superadmin'],
  hostelAdmin: () => [...DASHBOARD_KEYS.all, 'hosteladmin'],
};

export const useSuperAdminStats = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.superAdmin(),
    queryFn: async () => {
      const response = await dashboardApi.getSuperAdminStats();
      return response.data || response;
    },
  });
};

export const useHostelAdminStats = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.hostelAdmin(),
    queryFn: async () => {
      const response = await dashboardApi.getHostelAdminStats();
      return response.data || response;
    },
  });
};
