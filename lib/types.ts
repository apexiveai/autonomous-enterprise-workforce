export type ExecutionStatus =

  | "queued"

  | "running"

  | "planned"

  | "approved"

  | "completed"

  | "failed"

  | "rejected"

  | "pending_approval"

  | "waiting_approval";

export type AgentType =

  | "financial"

  | "contract"

  | "operations";

export interface ExecutionTask {

  task_id: string;

  description: string;

  agent: AgentType;

  depends_on?: string[];

  tool_name?: string | null;

  tool_arguments?: Record<string, unknown>;

  requires_approval?: boolean;

}

export interface ExecutionResultItem {

  task_id?: string;

  agent?: string;

  tool?: string;

  status?: string;

  result?: Record<string, unknown>;

}

export interface ExecutionPlan {

  objective?: string;

  requires_human_approval?: boolean;

  approval_reason?: string | null;

  tasks?: ExecutionTask[];

}

export interface Execution {

  run_id: string;

  thread_id?: string;

  goal: string;

  status: ExecutionStatus | string;

  current_task_id?: string | null;

  retry_count?: number;

  max_retries?: number;

  error?: string | null;

  result?: Record<string, unknown> | null;

  plan?: ExecutionPlan;

  completed_tasks?: string[];

  results?: ExecutionResultItem[];

  approval_request_id?: string | null;

  created_at?: string;

  started_at?: string | null;

  completed_at?: string | null;

}

export interface CreateExecutionResponse {

  run_id: string;

  thread_id: string;

  status: string;

  goal: string;

}

export interface Approval {

  id: string;

  workflow_run_id: string;

  execution_step_id?: string | null;

  tool_name: string;

  arguments: Record<string, unknown>;

  reason: string;

  risk_level: string;

  status: string;

  created_at: string;

  decided_at?: string | null;

}

export interface AuditEvent {

  id: string;

  action: string;

  resource_type: string;

  resource_id?: string | null;

  workflow_run_id?: string | null;

  details?: Record<string, unknown>;

  created_at: string;

}