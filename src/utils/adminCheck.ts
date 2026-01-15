/**
 * Admin user configuration and utilities
 */

// List of admin email addresses
const ADMIN_EMAILS = [
  'admin@tefprep.com',
];

/**
 * Check if a user is an admin based on their email
 */
export const isAdmin = (userEmail: string | null | undefined): boolean => {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail.toLowerCase());
};

/**
 * Check if the current user has admin privileges
 */
export const checkAdminAccess = (userEmail: string | null | undefined): boolean => {
  return isAdmin(userEmail);
};
