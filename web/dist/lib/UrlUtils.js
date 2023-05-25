export function getQueryParameters(baseUrl) {
    const url = new URL(baseUrl);
    return url.searchParams;
}
