export async function get(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  return fetch(url, options);
}
