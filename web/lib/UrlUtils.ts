export function getQueryParameters(baseUrl: string): URLSearchParams {
  const url = new URL(baseUrl);

  return url.searchParams as URLSearchParams;
}
