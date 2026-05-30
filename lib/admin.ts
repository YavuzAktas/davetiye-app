export const ADMIN_EMAILS = ["aylinyavuz@gmail.com", "mehlikaalan@icloud.com"];

export const isAdmin = (email: string | null | undefined): boolean =>
  ADMIN_EMAILS.includes(email ?? "");
