declare module "better-auth" {
  interface User {
    userType: "CUSTOMER" | "MERCHANT" | "STAFF";
    accountType?: "INDIVIDUAL" | "CORPORATION" | null;
    isSuperOwner: boolean;
    isDeleted: boolean;
    deletedAt?: Date | null;
  }
}
