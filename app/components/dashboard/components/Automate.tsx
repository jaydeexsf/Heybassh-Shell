import { useState } from "react";
import { CheckCircleIcon, ClockIcon, ArrowPathIcon, TrashIcon, Cog6ToothIcon, PlusIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, FunnelIcon } from "@heroicons/react/24/outline";

type WorkflowStatus = 'active' | 'paused' | 'draft' | 'error';
type TriggerType = 'time' | 'event' | 'api' | 'webhook';
type ActionType = 'email' | 'notification' | 'webhook' | 'data_update' | 'create_task' | 'update_status' | 'custom';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  lastRun: string | null;
  nextRun: string | null;
  trigger: {
    type: TriggerType;
    config: Record<string, any>;
  };
  actions: Array<{
    id: string;
    type: ActionType;
    config: Record<string, any>;
  }>;
  created: string;
  updated: string;
}

const statusStyles: Record<WorkflowStatus, { bg: string; text: string; icon: any }> = {
  active: {
    bg: 'bg-green-100 text-green-800',
    text: 'Active',
    icon: CheckCircleIcon,
  },
  paused: {
    bg: 'bg-yellow-100 text-yellow-800',
    text: 'Paused',
    icon: ClockIcon,
  },
  draft: {
    bg: 'bg-blue-100 text-blue-800',
    text: 'Draft',
    icon: ClockIcon,
  },
  error: {
    bg: 'bg-red-100 text-red-800',
    text: 'Error',
    icon: ArrowPathIcon,
  },
};

const triggerTypes: Record<TriggerType, { name: string; description: string }> = {
  time: {
    name: 'Schedule',
    description: 'Run on a schedule',
  },
  event: {
    name: 'Event',
    description: 'Run when an event occurs',
  },
  api: {
    name: 'API',
    description: 'Run via API call',
  },
  webhook: {
    name: 'Webhook',
    description: 'Run when a webhook is called',
  },
};

const actionTypes: Record<ActionType, { name: string; description: string }> = {
  email: {
    name: 'Send Email',
    description: 'Send an email to specified recipients',
  },
  notification: {
    name: 'Send Notification',
    description: 'Send an in-app notification',
  },
  webhook: {
    name: 'Webhook',
    description: 'Call a webhook with data',
  },
  data_update: {
    name: 'Update Data',
    description: 'Update records in the system',
  },
  create_task: {
    name: 'Create Task',
    description: 'Create a new task',
  },
  update_status: {
    name: 'Update Status',
    description: 'Update status of an item',
  },
  custom: {
    name: 'Custom Code',
    description: 'Run custom JavaScript code',
  },
};

const sampleWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Follow-up Email',
    description: 'Send follow-up email 2 days after a meeting',
    status: 'active',
    lastRun: '2023-04-15T10:30:00Z',
    nextRun: '2023-04-17T10:30:00Z',
    trigger: {
      type: 'event',
      config: { event: 'meeting_completed' },
    },
    actions: [
      {
        id: 'act-1',
        type: 'email',
        config: {
          template: 'meeting_followup',
          recipients: ['{{meeting.attendees}}'],
          subject: 'Follow-up from our meeting',
        },
      },
    ],
    created: '2023-03-01T09:00:00Z',
    updated: '2023-04-01T14:30:00Z',
  },
  {
    id: 'wf-2',
    name: 'Weekly Report',
    description: 'Generate and send weekly performance report',
    status: 'active',
    lastRun: '2023-04-10T09:00:00Z',
    nextRun: '2023-04-17T09:00:00Z',
    trigger: {
      type: 'time',
      config: { schedule: '0 9 * * 1' }, // Every Monday at 9 AM
    },
    actions: [
      {
        id: 'act-1',
        type: 'email',
        config: {
          template: 'weekly_report',
          recipients: ['team@example.com'],
          subject: 'Weekly Performance Report',
        },
      },
    ],
    created: '2023-02-15T11:20:00Z',
    updated: '2023-04-01T10:15:00Z',
  },
  {
    id: 'wf-3',
    name: 'New Lead Notification',
    description: 'Notify sales team of new leads',
    status: 'paused',
    lastRun: '2023-04-12T14:45:00Z',
    nextRun: null,
    trigger: {
      type: 'event',
      config: { event: 'lead_created' },
    },
    actions: [
      {
        id: 'act-1',
        type: 'notification',
        config: {
          message: 'New lead: {{lead.name}}',
          channel: 'sales',
        },
      },
    ],
    created: '2023-03-20T16:30:00Z',
    updated: '2023-04-05T11:20:00Z',
  },
  {
    id: 'wf-4',
    name: 'Task Reminder',
    description: 'Send reminder for due tasks',
    status: 'draft',
    lastRun: null,
    nextRun: null,
    trigger: {
      type: 'time',
      config: { schedule: '0 9 * * *' }, // Daily at 9 AM
    },
    actions: [
      {
        id: 'act-1',
        type: 'notification',
        config: {
          message: 'You have {{tasks.due_today}} tasks due today',
          channel: 'user_preferences',
        },
      },
    ],
    created: '2023-04-05T15:10:00Z',
    updated: '2023-04-05T15:10:00Z',
  },
];

export function Automate() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);;

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      status: 'draft',
      lastRun: null,
      nextRun: null,
      trigger: {
        type: 'event',
        config: {},
      },
      actions: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setIsCreating(true);
  };

  const handleUpdateWorkflow = (updatedWorkflow: Workflow) => {
    setWorkflows(workflows.map(wf => 
      wf.id === updatedWorkflow.id ? { ...updatedWorkflow, updated: new Date().toISOString() } : wf
    ));
    setSelectedWorkflow(updatedWorkflow);
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflowToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteWorkflow = () => {
    if (!workflowToDelete) return;
    setWorkflows(workflows.filter(wf => wf.id !== workflowToDelete));
    if (selectedWorkflow?.id === workflowToDelete) {
      setSelectedWorkflow(null);
    }
    setIsDeleteConfirmOpen(false);
    setWorkflowToDelete(null);
  };

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === id) {
        const newStatus = workflow.status === 'active' ? 'paused' : 'active';
        return { 
          ...workflow, 
          status: newStatus,
          updated: new Date().toISOString() 
        };
      }
      return workflow;
    }));
  };

  const runWorkflow = (id: string) => {
    // In a real app, this would trigger the workflow via an API call
    console.log(`Running workflow ${id}`);
    // Simulate updating last run time
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === id) {
        return { 
          ...workflow, 
          lastRun: new Date().toISOString(),
          updated: new Date().toISOString() 
        };
      }
      return workflow;
    }));
  };

  const duplicateWorkflow = (workflow: Workflow) => {
    const newWorkflow = {
      ...workflow,
      id: `wf-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      status: 'draft' as const,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
  };

  const exportWorkflow = (workflow: Workflow) => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportName = `workflow-${workflow.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        // Basic validation
        if (workflow.name && workflow.trigger && Array.isArray(workflow.actions)) {
          const newWorkflow = {
            ...workflow,
            id: `wf-${Date.now()}`,
            status: 'draft' as const,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          };
          setWorkflows([...workflows, newWorkflow]);
          setSelectedWorkflow(newWorkflow);
        } else {
          alert('Invalid workflow file');
        }
      } catch (error) {
        console.error('Error parsing workflow file', error);
        alert('Error importing workflow');
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be imported again if needed
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Automate</h2>
        <p className="mt-1 text-sm text-gray-400">
          Create and manage automated workflows to streamline your processes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-white">Workflows</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCreateWorkflow}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <PlusIcon className="h-3.5 w-3.5 mr-1" />
                  New
                </button>
                <div className="relative">
                  <label className="inline-flex items-center rounded-md bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-600 cursor-pointer">
                    <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importWorkflow}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border border-gray-700 bg-gray-800 py-1.5 pl-10 pr-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                    onClick={() => setSearchQuery('')}
                  >
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="status-filter" className="sr-only">
                Filter by status
              </label>
              <select
                id="status-filter"
                className="block w-full rounded-md border-gray-700 bg-gray-800 py-1.5 pl-3 pr-10 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {filteredWorkflows.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400">No workflows found</p>
                  <button
                    type="button"
                    onClick={handleCreateWorkflow}
                    className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                    Create Workflow
                  </button>
                </div>
              ) : (
                filteredWorkflows.map((workflow) => {
                  const status = statusStyles[workflow.status];
                  const StatusIcon = status.icon;
                  
                  return (
                    <button
                      key={workflow.id}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm ${
                        selectedWorkflow?.id === workflow.id
                          ? 'bg-indigo-900/50 text-white'
                          : 'text-gray-300 hover:bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{workflow.name}</p>
                        <div className="mt-0.5 flex items-center">
                          <StatusIcon
                            className={`mr-1.5 h-3.5 w-3.5 flex-shrink-0 ${
                              workflow.status === 'active'
                                ? 'text-green-400'
                                : workflow.status === 'paused'
                                ? 'text-yellow-400'
                                : workflow.status === 'error'
                                ? 'text-red-400'
                                : 'text-blue-400'
                            }`}
                            aria-hidden="true"
                          />
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${status.bg}`}>
                            {status.text}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-gray-300">
                          {workflow.actions.length}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-4">
            <h3 className="mb-3 text-sm font-medium text-white">Templates</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50"
                onClick={() => {
                  // In a real app, this would load a template
                  alert('Template functionality coming soon!');
                }}
              >
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10">
                  <EnvelopeIcon className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium">Welcome Email</p>
                  <p className="text-xs text-gray-400">Send welcome email to new users</p>
                </div>
              </button>
              <button
                type="button"
                className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50"
                onClick={() => {
                  // In a real app, this would load a template
                  alert('Template functionality coming soon!');
                }}
              >
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500/10">
                  <BellIcon className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">Task Reminder</p>
                  <p className="text-xs text-gray-400">Send reminder for due tasks</p>
                </div>
              </button>
              <button
                type="button"
                className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800/50"
                onClick={() => {
                  // In a real app, this would load a template
                  alert('Template functionality coming soon!');
                }}
              >
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10">
                  <DocumentTextIcon className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Weekly Report</p>
                  <p className="text-xs text-gray-400">Generate and send weekly reports</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {selectedWorkflow ? (
            <div className="rounded-lg border border-gray-700 bg-[#1a2035] p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-white">
                      {selectedWorkflow.name}
                    </h3>
                    <span className="ml-2 inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                      {selectedWorkflow.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    {selectedWorkflow.description || 'No description provided'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => runWorkflow(selectedWorkflow.id)}
                  >
                    <PlayIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                    Run
                  </button>
                  <div className="relative">
                    <Menu>
                      <Menu.Button className="inline-flex items-center rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  className={`${
                                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                  } flex w-full items-center px-4 py-2 text-sm`}
                                  onClick={() => duplicateWorkflow(selectedWorkflow)}
                                >
                                  <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                                  Duplicate
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  className={`${
                                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                  } flex w-full items-center px-4 py-2 text-sm`}
                                  onClick={() => exportWorkflow(selectedWorkflow)}
                                >
                                  <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                                  Export
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  className={`${
                                    active ? 'bg-gray-700 text-white' : 'text-gray-300'
                                  } flex w-full items-center px-4 py-2 text-sm`}
                                  onClick={() => {
                                    toggleWorkflowStatus(selectedWorkflow.id);
                                  }}
                                >
                                  {selectedWorkflow.status === 'active' ? (
                                    <>
                                      <PauseIcon className="mr-2 h-4 w-4" />
                                      Pause
                                    </>
                                  ) : (
                                    <>
                                      <PlayIcon className="mr-2 h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  className={`${
                                    active ? 'bg-red-600 text-white' : 'text-red-500'
                                  } flex w-full items-center px-4 py-2 text-sm`}
                                  onClick={() => handleDeleteWorkflow(selectedWorkflow.id)}
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                <h4 className="mb-3 text-sm font-medium text-white">Workflow Details</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-400">Status</dt>
                    <dd className="mt-1 text-sm text-white">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusStyles[selectedWorkflow.status].bg}`}>
                        {statusStyles[selectedWorkflow.status].text}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400">Last Run</dt>
                    <dd className="mt-1 text-sm text-white">
                      {selectedWorkflow.lastRun ? new Date(selectedWorkflow.lastRun).toLocaleString() : 'Never'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400">Next Run</dt>
                    <dd className="mt-1 text-sm text-white">
                      {selectedWorkflow.nextRun ? new Date(selectedWorkflow.nextRun).toLocaleString() : 'Not scheduled'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400">Created</dt>
                    <dd className="mt-1 text-sm text-white">
                      {new Date(selectedWorkflow.created).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-400">Last Updated</dt>
                    <dd className="mt-1 text-sm text-white">
                      {new Date(selectedWorkflow.updated).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Trigger</h4>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-gray-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      // In a real app, this would open a modal to edit the trigger
                      alert('Edit trigger functionality coming soon!');
                    }}
                  >
                    <PencilSquareIcon className="-ml-0.5 mr-1 h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                  <div className="flex items-start">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500/10">
                      <BoltIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="ml-4">
                      <h5 className="text-sm font-medium text-white">
                        {triggerTypes[selectedWorkflow.trigger.type]?.name || 'Custom Trigger'}
                      </h5>
                      <p className="mt-1 text-sm text-gray-400">
                        {triggerTypes[selectedWorkflow.trigger.type]?.description || 'Custom trigger configuration'}
                      </p>
                      {selectedWorkflow.trigger.config && Object.keys(selectedWorkflow.trigger.config).length > 0 && (
                        <div className="mt-2 rounded-md bg-gray-900/50 p-2">
                          <pre className="overflow-x-auto text-xs text-gray-300">
                            {JSON.stringify(selectedWorkflow.trigger.config, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Actions</h4>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      // In a real app, this would open a modal to add an action
                      const newAction = {
                        id: `act-${Date.now()}`,
                        type: 'notification' as ActionType,
                        config: {},
                      };
                      const updatedWorkflow = {
                        ...selectedWorkflow,
                        actions: [...selectedWorkflow.actions, newAction],
                      };
                      handleUpdateWorkflow(updatedWorkflow);
                    }}
                  >
                    <PlusIcon className="-ml-0.5 mr-1 h-3.5 w-3.5" />
                    Add Action
                  </button>
                </div>

                {selectedWorkflow.actions.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-700 p-6 text-center">
                    <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-500" />
                    <h5 className="mt-2 text-sm font-medium text-gray-300">No actions yet</h5>
                    <p className="mt-1 text-xs text-gray-500">
                      Add actions to be executed when this workflow is triggered
                    </p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        // In a real app, this would open a modal to add an action
                        const newAction = {
                          id: `act-${Date.now()}`,
                          type: 'notification' as ActionType,
                          config: {},
                        };
                        const updatedWorkflow = {
                          ...selectedWorkflow,
                          actions: [...selectedWorkflow.actions, newAction],
                        };
                        handleUpdateWorkflow(updatedWorkflow);
                      }}
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Add Your First Action
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedWorkflow.actions.map((action, index) => {
                      const actionType = actionTypes[action.type] || {
                        name: 'Custom Action',
                        description: 'Custom action configuration',
                      };
                      
                      return (
                        <div
                          key={action.id}
                          className="group relative rounded-lg border border-gray-700 bg-gray-800/50 p-4 hover:border-gray-600"
                        >
                          <div className="flex items-start">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500/10">
                              <Cog6ToothIcon className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-medium text-white">
                                  {actionType.name} {index > 0 && `#${index + 1}`}
                                </h5>
                                <span className="inline-flex items-center rounded bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
                                  {action.type}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-400">
                                {actionType.description}
                              </p>
                              {action.config && Object.keys(action.config).length > 0 && (
                                <div className="mt-2 rounded-md bg-gray-900/50 p-2">
                                  <pre className="overflow-x-auto text-xs text-gray-300">
                                    {JSON.stringify(action.config, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="absolute right-2 top-2 flex opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              className="rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                              onClick={() => {
                                // In a real app, this would open a modal to edit the action
                                alert('Edit action functionality coming soon!');
                              }}
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button
                              type="button"
                              className="ml-1 rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-red-400"
                              onClick={() => {
                                const updatedWorkflow = {
                                  ...selectedWorkflow,
                                  actions: selectedWorkflow.actions.filter((a) => a.id !== action.id),
                                };
                                handleUpdateWorkflow(updatedWorkflow);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </button>
                            {index > 0 && (
                              <button
                                type="button"
                                className="ml-1 rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                                onClick={() => {
                                  const newActions = [...selectedWorkflow.actions];
                                  const temp = newActions[index];
                                  newActions[index] = newActions[index - 1];
                                  newActions[index - 1] = temp;
                                  const updatedWorkflow = {
                                    ...selectedWorkflow,
                                    actions: newActions,
                                  };
                                  handleUpdateWorkflow(updatedWorkflow);
                                }}
                              >
                                <ArrowUpIcon className="h-4 w-4" />
                                <span className="sr-only">Move up</span>
                              </button>
                            )}
                            {index < selectedWorkflow.actions.length - 1 && (
                              <button
                                type="button"
                                className="ml-1 rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
                                onClick={() => {
                                  const newActions = [...selectedWorkflow.actions];
                                  const temp = newActions[index];
                                  newActions[index] = newActions[index + 1];
                                  newActions[index + 1] = temp;
                                  const updatedWorkflow = {
                                    ...selectedWorkflow,
                                    actions: newActions,
                                  };
                                  handleUpdateWorkflow(updatedWorkflow);
                                }}
                              >
                                <ArrowDownIcon className="h-4 w-4" />
                                <span className="sr-only">Move down</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  className="rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    // In a real app, this would discard changes
                    setSelectedWorkflow(workflows.find(wf => wf.id === selectedWorkflow.id) || selectedWorkflow);
                  }}
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    // In a real app, this would save the workflow
                    const updatedWorkflow = {
                      ...selectedWorkflow,
                      status: 'active',
                      updated: new Date().toISOString(),
                    };
                    handleUpdateWorkflow(updatedWorkflow);
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-white">No workflow selected</h3>
              <p className="mt-1 text-sm text-gray-400">
                Select a workflow from the sidebar or create a new one to get started.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleCreateWorkflow}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  New Workflow
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Transition.Root show={isDeleteConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsDeleteConfirmOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#1a2035] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-white">
                        Delete workflow
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          Are you sure you want to delete this workflow? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={confirmDeleteWorkflow}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setIsDeleteConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

// Add missing icon components
function EnvelopeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function DocumentTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function PencilSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function DocumentDuplicateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
}

function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

// Add Dialog and Transition components
type DialogProps = {
  open: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
};

function Dialog({ open, onClose, children, className = '' }: DialogProps) {
  return (
    <div className={`fixed inset-0 z-10 overflow-y-auto ${!open && 'hidden'}`}>
      {children}
    </div>
  );
}

Dialog.Panel = function DialogPanel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-screen px-4 text-center ${className}`}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="inline-block h-screen w-full max-w-md p-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
        {children}
      </div>
    </div>
  );
};

Dialog.Title = 'div';

const Transition = {
  Root: 'div',
  Child: 'div',
} as any;

// Add Menu component
function Menu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Menu.Button) {
          return React.cloneElement(child as React.ReactElement, { 
            onClick: () => setIsOpen(!isOpen) 
          });
        }
        return child;
      })}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === Menu.Items) {
              return child;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

Menu.Button = 'button';
Menu.Items = function MenuItems({ children }: { children: React.ReactNode }) {
  return <div className="py-1">{children}</div>;
};
Menu.Item = function MenuItem({ children, className = '', ...props }: { children: React.ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${className} w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100`}
      {...props}
    >
      {children}
    </button>
  );
};

// Add ExclamationTriangleIcon
function ExclamationTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

// Add EllipsisVerticalIcon
function EllipsisVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  );
}
