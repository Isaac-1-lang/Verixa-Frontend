/**
 * Name Formatting Utilities
 * Handles various name format conversions
 */

/**
 * Extract last name from full name
 * @param {string} fullName - Full name string (e.g., "NIYOBYOSE Isaac Precieux")
 * @returns {string} Last name or fallback
 */
export const getLastName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return 'User';
  }

  // Trim whitespace
  const trimmed = fullName.trim();
  
  if (!trimmed) {
    return 'User';
  }

  // Split by spaces and filter empty strings
  const nameParts = trimmed.split(/\s+/).filter(part => part.length > 0);
  
  // If no spaces (single name), return as is
  if (nameParts.length === 0) {
    return 'User';
  }
  
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  // Return the last part
  return nameParts[nameParts.length - 1];
};

/**
 * Extract first name from full name
 * @param {string} fullName - Full name string
 * @returns {string} First name
 */
export const getFirstName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return 'User';
  }

  const trimmed = fullName.trim();
  
  if (!trimmed) {
    return 'User';
  }

  const nameParts = trimmed.split(/\s+/).filter(part => part.length > 0);
  
  return nameParts.length > 0 ? nameParts[0] : 'User';
};

/**
 * Get initials from full name
 * @param {string} fullName - Full name string
 * @param {number} maxInitials - Maximum number of initials (default: 2)
 * @returns {string} Initials (e.g., "NIP" for "NIYOBYOSE Isaac Precieux")
 */
export const getInitials = (fullName, maxInitials = 2) => {
  if (!fullName || typeof fullName !== 'string') {
    return 'U';
  }

  const trimmed = fullName.trim();
  
  if (!trimmed) {
    return 'U';
  }

  const nameParts = trimmed.split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    return 'U';
  }

  // Get first letter of each part, up to maxInitials
  const initials = nameParts
    .slice(0, maxInitials)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
  
  return initials || 'U';
};

/**
 * Format full name for display (First Last)
 * @param {string} fullName - Full name string
 * @returns {string} Formatted name
 */
export const formatDisplayName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return 'User';
  }

  const trimmed = fullName.trim();
  
  if (!trimmed) {
    return 'User';
  }

  const nameParts = trimmed.split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    return 'User';
  }
  
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  // Return "FirstName LastName"
  return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
};

/**
 * Shorten full name for compact display
 * Examples:
 * - "John Doe" -> "John D."
 * - "John Michael Doe" -> "John D."
 * @param {string} fullName - Full name string
 * @returns {string} Shortened name
 */
export const getShortenedName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') {
    return 'User';
  }

  const trimmed = fullName.trim();
  
  if (!trimmed) {
    return 'User';
  }

  const nameParts = trimmed.split(/\s+/).filter(part => part.length > 0);
  
  if (nameParts.length === 0) {
    return 'User';
  }
  
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  // Return "FirstName L."
  const firstName = nameParts[0];
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  
  return `${firstName} ${lastInitial}.`;
};

/**
 * Format name for greeting
 * Uses first name for informal greeting
 * @param {string} fullName - Full name string
 * @returns {string} Greeting name
 */
export const getGreetingName = (fullName) => {
  const firstName = getFirstName(fullName);
  return firstName;
};

/**
 * Format name for formal display
 * Uses last name with title
 * @param {string} fullName - Full name string
 * @param {string} title - Title (Mr., Mrs., Dr., etc.)
 * @returns {string} Formal name
 */
export const getFormalName = (fullName, title = '') => {
  const lastName = getLastName(fullName);
  return title ? `${title} ${lastName}` : lastName;
};
