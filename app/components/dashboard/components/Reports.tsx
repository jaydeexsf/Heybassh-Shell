import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

type ReportType = 'sales' | 'revenue' | 'expenses' | 'profit' | 'customers' | 'products' | 'inventory' | 'employees' | 'tasks' | 'projects';

type TimeRange = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year' | 'custom';

type ChartType = 'bar' | 'line' | 'pie' | 'table';

interface ReportFilter {
  type: ReportType;
  timeRange: TimeRange;
  chartType: ChartType;
  groupBy: string;
  compareToPrevious: boolean;
  customStartDate?: string;
  customEndDate?: string;
}

type ReportData = {
  name: string;
  [key: string]: string | number;
}[];

export function Reports() {
  const [activeTab, setActiveTab] = useState<ReportType>('sales');
  const [timeRange, setTimeRange] = useState<TimeRange>('this_month');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [groupBy, setGroupBy] = useState('day');
  const [compareToPrevious, setCompareToPrevious] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedReports, setSavedReports] = useState<Array<{id: string; name: string; type: ReportType}>>([]);
  
  // Sample data - in a real app, this would come from an API
  const salesData: ReportData = [
    { name: 'Jan', sales: 4000, revenue: 2400, profit: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398, profit: 2210 },
    { name: 'Mar', sales: 2000, revenue: 9800, profit: 2290 },
    { name: 'Apr', sales: 2780, revenue: 3908, profit: 2000 },
    { name: 'May', sales: 1890, revenue: 4800, profit: 2181 },
    { name: 'Jun', sales: 2390, revenue: 3800, profit: 2500 },
    { name: 'Jul', sales: 3490, revenue: 4300, profit: 2100 },
  ];

  const productData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 300 },
    { name: 'Product D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const renderChart = () => {
    const data = activeTab === 'products' ? productData : salesData;
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={activeTab} fill="#8884d8" />
              {compareToPrevious && <Bar dataKey="previous" fill="#82ca9d" />}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={activeTab} stroke="#8884d8" activeDot={{ r: 8 }} />
              {compareToPrevious && <Line type="monotone" dataKey="previous" stroke="#82ca9d" />}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <div className="flex justify-center">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        );
      case 'table':
        return (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  {compareToPrevious && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Previous
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-[#1a2035] divide-y divide-gray-700">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                      {typeof item[activeTab] === 'number' ? `$${item[activeTab].toLocaleString()}` : item[activeTab]}
                    </td>
                    {compareToPrevious && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                        {typeof item.previous === 'number' ? `$${item.previous.toLocaleString()}` : item.previous || '-'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSaveReport = () => {
    const newReport = {
      id: `report-${Date.now()}`,
      name: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: activeTab,
    };
    setSavedReports([...savedReports, newReport]);
    setIsSaving(false);
  };

  const reportTypes: {id: ReportType; name: string; icon: string}[] = [
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'revenue', name: 'Revenue', icon: '💵' },
    { id: 'expenses', name: 'Expenses', icon: '💸' },
    { id: 'profit', name: 'Profit', icon: '📈' },
    { id: 'customers', name: 'Customers', icon: '👥' },
    { id: 'products', name: 'Products', icon: '📦' },
    { id: 'inventory', name: 'Inventory', icon: '📊' },
    { id: 'employees', name: 'Employees', icon: '👨‍💼' },
    { id: 'tasks', name: 'Tasks', icon: '✅' },
    { id: 'projects', name: 'Projects', icon: '📋' },
  ];

  const timeRanges: {id: TimeRange; name: string}[] = [
    { id: 'today', name: 'Today' },
    { id: 'yesterday', name: 'Yesterday' },
    { id: 'this_week', name: 'This Week' },
    { id: 'last_week', name: 'Last Week' },
    { id: 'this_month', name: 'This Month' },
    { id: 'last_month', name: 'Last Month' },
    { id: 'this_quarter', name: 'This Quarter' },
    { id: 'last_quarter', name: 'Last Quarter' },
    { id: 'this_year', name: 'This Year' },
    { id: 'last_year', name: 'Last Year' },
    { id: 'custom', name: 'Custom Range' },
  ];

  const chartTypes: {id: ChartType; name: string; icon: string}[] = [
    { id: 'bar', name: 'Bar Chart', icon: '📊' },
    { id: 'line', name: 'Line Chart', icon: '📈' },
    { id: 'pie', name: 'Pie Chart', icon: '' },
    { id: 'table', name: 'Data Table', icon: '📋' },
  ];

  const groupByOptions = [
    { id: 'day', name: 'Day' },
    { id: 'week', name: 'Week' },
    { id: 'month', name: 'Month' },
    { id: 'quarter', name: 'Quarter' },
    { id: 'year', name: 'Year' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
        <p className="mt-1 text-sm text-gray-400">
          Generate and analyze reports to gain insights into your business performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Report Types */}
          <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-4">
            <h3 className="mb-3 text-sm font-medium text-white">Report Type</h3>
            <div className="space-y-2">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex w-full items-center space-x-2 rounded-md px-3 py-2 text-left text-sm ${
                    activeTab === type.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-4">
            <h3 className="mb-3 text-sm font-medium text-white">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                  className="block w-full rounded-md border-gray-700 bg-gray-800 py-2 pl-3 pr-10 text-base text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {timeRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Chart Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setChartType(type.id)}
                      className={`flex items-center justify-center space-x-1 rounded-md px-2 py-1.5 text-sm ${
                        chartType === type.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">
                  Group By
                </label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="block w-full rounded-md border-gray-700 bg-gray-800 py-2 pl-3 pr-10 text-base text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  {groupByOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="compare"
                  name="compare"
                  type="checkbox"
                  checked={compareToPrevious}
                  onChange={(e) => setCompareToPrevious(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="compare" className="ml-2 block text-sm text-gray-300">
                  Compare to previous period
                </label>
              </div>
            </div>
          </div>

          {/* Saved Reports */}
          <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Saved Reports</h3>
              <button
                onClick={() => setIsSaving(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Save Current
              </button>
            </div>
            {savedReports.length > 0 ? (
              <div className="space-y-1">
                {savedReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setActiveTab(report.type)}
                    className={`block w-full truncate rounded px-2 py-1.5 text-left text-sm ${
                      activeTab === report.type
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    title={report.name}
                  >
                    {report.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-gray-400">No saved reports yet</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">
                  {reportTypes.find((t) => t.id === activeTab)?.name} Report
                </h3>
                <p className="text-sm text-gray-400">
                  {timeRanges.find((t) => t.id === timeRange)?.name}
                  {compareToPrevious && ' (with comparison to previous period)'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg
                    className="-ml-1 mr-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <svg
                    className="-ml-1 mr-1 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Details
                </button>
              </div>
            </div>

            <div className="h-[400px] w-full">
              {renderChart()}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-400">Total {activeTab}</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  ${(Math.random() * 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </dd>
                <div className="mt-2 flex items-baseline text-sm">
                  <span className="flex items-center text-green-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    <span className="ml-1">
                      {Math.floor(Math.random() * 25) + 5}% from last period
                    </span>
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-400">Average per {groupBy}</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  ${(Math.random() * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </dd>
                <div className="mt-2 flex items-baseline text-sm">
                  <span className="flex items-center text-green-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    <span className="ml-1">
                      {Math.floor(Math.random() * 15) + 1}% from last period
                    </span>
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-400">Highest {groupBy}</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  ${(Math.random() * 5000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </dd>
                <div className="mt-2 text-sm text-gray-400">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-400">Forecast (next {groupBy})</dt>
                <dd className="mt-1 text-3xl font-semibold text-white">
                  ${(Math.random() * 12000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </dd>
                <div className="mt-2 flex items-baseline text-sm">
                  <span className="flex items-center text-green-500">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="ml-1">
                      {Math.floor(Math.random() * 30) + 5}% expected growth
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Report Modal */}
      {isSaving && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-[#1a2035] p-6 shadow-xl">
            <h3 className="text-lg font-medium text-white">Save Report</h3>
            <div className="mt-4">
              <label htmlFor="report-name" className="block text-sm font-medium text-gray-300">
                Report Name
              </label>
              <input
                type="text"
                id="report-name"
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter report name"
                defaultValue={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report - ${new Date().toLocaleDateString()}`}
              />
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                onClick={handleSaveReport}
              >
                Save
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-700 bg-[#1a2035] px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                onClick={() => setIsSaving(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
