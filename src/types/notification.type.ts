export interface INotification {
  id: string;
  userId: string;
  type: string;
  channel: "EMAIL" | "SMS" | "IN_APP";
  status: "PENDING" | "SENT" | "FAILED";
  subject?: string | null;
  body?: string | null;
  sentAt?: string | null;
  createdAt: string;
}

export interface INotificationCreatePayload {
  userId: string;
  type: string;
  channel?: "EMAIL" | "SMS" | "IN_APP";
  subject?: string;
  body?: string;
}
