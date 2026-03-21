import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useAuth } from "../../context/AuthContext";

export default function EcommerceMetrics({ dashboardData }) {
  const { UserRole } = useAuth();
  const isAdmin = UserRole === "admin";

  const totalUsers = dashboardData?.totalUsers || 0;
  const totalPosters = dashboardData?.totalPosters || 0;
  const totalTemplate = dashboardData?.totalTemplate || 0;
  const todayPosters = dashboardData?.todayPosters || 0;

  const userGrowth = totalUsers > 0 ? ((todayPosters / totalUsers) * 100).toFixed(2) : 0;
  const posterGrowth = totalPosters > 0 ? ((todayPosters / totalPosters) * 100).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">

      {/* Admin only: Total Users */}
      {isAdmin && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {totalUsers.toLocaleString()}
              </h4>
            </div>
            <Badge color={userGrowth > 0 ? "success" : "error"}>
              {userGrowth > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(userGrowth)}%
            </Badge>
          </div>
        </div>
      )}

      {/* Total Posters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Posters</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalPosters.toLocaleString()}
            </h4>
          </div>
          <Badge color={posterGrowth > 0 ? "success" : "error"}>
            {posterGrowth > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(posterGrowth)}%
          </Badge>
        </div>
      </div>

      {/* Admin only: Total Templates */}
      {isAdmin && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Templates</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {totalTemplate.toLocaleString()}
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              0.00%
            </Badge>
          </div>
        </div>
      )}

      {/* Today's Posters - visible to all */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Today's Posters</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {todayPosters.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            Today
          </Badge>
        </div>
      </div>

    </div>
  );
}