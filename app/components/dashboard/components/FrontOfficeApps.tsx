import { useState } from "react";
import { FrontOfficeApp } from "../types";

interface FrontOfficeAppsProps {
  apps: FrontOfficeApp[];
  onAddApp: (app: Omit<FrontOfficeApp, 'id'>) => void;
}

export function FrontOfficeApps({ apps, onAddApp }: FrontOfficeAppsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newApp, setNewApp] = useState<Omit<FrontOfficeApp, 'id'>>({ 
    name: '', 
    type: 'website',
    status: 'active',
    url: ''
  });

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    onAddApp(newApp);
    setNewApp({ name: '', type: 'website', status: 'active', url: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Front Office Apps</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add New App
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 rounded-lg bg-[#1a2035] p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-white">Add New App</h3>
          <form onSubmit={handleAddApp} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300">App Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newApp.name}
                  onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newApp.type}
                  onChange={(e) => setNewApp({...newApp, type: e.target.value as any})}
                >
                  <option value="website">Website</option>
                  <option value="portal">Portal</option>
                  <option value="mobile">Mobile App</option>
                  <option value="chat">Live Chat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">URL</label>
                <input
                  type="url"
                  required
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newApp.url}
                  onChange={(e) => setNewApp({...newApp, url: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Status</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newApp.status}
                  onChange={(e) => setNewApp({...newApp, status: e.target.value as any})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Add App
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <div key={app.id} className="rounded-lg border border-gray-700 bg-[#1a2035] p-6 shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{app.name}</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                app.status === 'active' ? 'bg-green-100 text-green-800' :
                app.status === 'inactive' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Type: <span className="text-white">{app.type}</span>
            </p>
            <p className="mt-1 text-sm text-gray-400">
              URL: <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{app.url}</a>
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">ID: {app.id}</span>
              <button className="text-sm text-indigo-400 hover:text-indigo-300">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
