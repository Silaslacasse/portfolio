export type DeliveryStatus = "pending" | "sent" | "failed" | "skipped";

/** A stored contact-form submission as the admin inbox sees it. */
export interface AdminMessage {
  _id: string;
  name: string;
  society: string;
  email: string;
  mobile: string;
  /** Only on messages received before the 2026-09 form; the fields no longer exist. */
  firstName?: string;
  linkedIn?: string;
  message: string;
  deliveryStatus: DeliveryStatus;
  deliveryError: string | null;
  readAt: string | null;
  archivedAt: string | null;
  createdAt: string;
}
