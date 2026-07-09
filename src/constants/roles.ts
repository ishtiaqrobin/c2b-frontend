export const Roles = {
  CUSTOMER: "CUSTOMER",
  MERCHANT: "MERCHANT",
  STAFF: "STAFF",
  SUPER_OWNER: "SUPER_OWNER",
} as const;

export type RoleType = (typeof Roles)[keyof typeof Roles];
