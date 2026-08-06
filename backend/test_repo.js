import { DashboardRepository } from './src/modules/dashboard/repository/dashboard.repository.js';

async function main() {
  try {
    const stats = await DashboardRepository.getHostelAdminStats();
    console.log(JSON.stringify(stats, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}
main();
