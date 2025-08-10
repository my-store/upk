export async function JSONGet(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const req = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const res = await req.json();
  return res;
}

export async function JSONPost(
  url: string,
  options?: RequestInit,
): Promise<any> {
  const req = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: options?.body,
    ...options,
  });
  const res = await req.json();
  return res;
}
