import type {
  Approval,
  AuditEvent,
  CreateExecutionResponse,
  Execution,
} from "./types";
import { apiRequest } from "./http";

export async function createExecution(
  goal: string,
): Promise<CreateExecutionResponse> {
  return apiRequest<CreateExecutionResponse>("/executions", {
    method: "POST",
    body: JSON.stringify({ goal }),
  });
}

export async function getExecution(
  runId: string,
  signal?: AbortSignal,
): Promise<Execution> {
  return apiRequest<Execution>(`/executions/${encodeURIComponent(runId)}`, {
    signal,
  });
}

export async function getExecutions(): Promise<Execution[]> {
  return request<Execution[]>("/executions");
}

export async function getApprovals(
  signal?: AbortSignal,
): Promise<Approval[]> {
  const data = await apiRequest<Approval[] | { items: Approval[] }>(
    "/approvals",
    { signal },
  );
  return Array.isArray(data) ? data : data.items;
}

export async function approveExecution(
  approvalId: string,
  comment?: string,
  signal?: AbortSignal,
): Promise<unknown> {
  return apiRequest(
    `/approvals/${encodeURIComponent(approvalId)}/approve`,
    {
      method: "POST",
      body: JSON.stringify({ comment: comment || null }),
      signal,
    },
  );
}

export async function rejectExecution(
  approvalId: string,
  comment?: string,
  signal?: AbortSignal,
): Promise<unknown> {
  return apiRequest(
    `/approvals/${encodeURIComponent(approvalId)}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ comment: comment || null }),
      signal,
    },
  );
}

export async function getAuditEvents(
  signal?: AbortSignal,
): Promise<AuditEvent[]> {
  const data = await apiRequest<AuditEvent[] | { items: AuditEvent[] }>(
    "/audit",
    { signal },
  );
  return Array.isArray(data) ? data : data.items;
}

export async function getHealth(): Promise<unknown> {
  return apiRequest("/health");
}
