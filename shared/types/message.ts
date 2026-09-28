export type DeliveryStatus = "pending" | "sent" | "failed" | "skipped";

/** A stored contact-form submission as the admin inbox sees it. */
export interface AdminMessage {
  _id: string;
  name: string;
  firstName: string;
  society: string;
  email: string;
  linkedIn: string;
  mobile: string;
  message: string;
  deliveryStatus: DeliveryStatus;
  deliveryError: string | null;
  readAt: string | null;
  archivedAt: string | null;
  createdAt: string;
}
