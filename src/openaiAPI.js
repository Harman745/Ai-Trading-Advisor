// Requests stay on the application's origin. The server handles model credentials.
export async function requestAdvisor(task, fields) {
  const response = await fetch('/api/advisor', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({task, ...fields})
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.result == null) {
    throw new Error(data?.error || 'The advisor server is unavailable. Please try again.');
  }
  return data.result;
}
