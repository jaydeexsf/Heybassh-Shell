import { Pill } from "./Pill";

interface OverviewProps {
  companyName: string;
}

export function Overview({ companyName }: OverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Welcome back, {companyName}!</h2>
        <div className="flex space-x-2">
          <Pill>Dashboard</Pill>
          <Pill>Quick Actions</Pill>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        {[
          { title: "Total Revenue", value: "$24,780", change: "+12.5%", trend: "up" },
          { title: "Active Users", value: "1,429", change: "+8.2%", trend: "up" },
          { title: "Tasks Completed", value: "87/124", change: "+5.1%", trend: "up" },
        ].map((stat, index) => (
          <div key={index} className="rounded-lg bg-[#1a2035] p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`rounded-full p-2 ${stat.trend === 'up' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-[#1a2035] p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { id: 1, user: "Alex Johnson", action: "created a new task", time: "2 min ago" },
            { id: 2, user: "Maria Garcia", action: "updated the project timeline", time: "1 hour ago" },
            { id: 3, user: "John Smith", action: "commented on the design", time: "3 hours ago" },
          ].map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                {activity.user.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-white">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
