// Simple logging utility for the backend
export function log(message: string, category?: string): void {
  const timestamp = new Date().toISOString();
  const categoryPrefix = category ? `[${category}]` : '';
  console.log(`${timestamp} ${categoryPrefix} ${message}`);
} 