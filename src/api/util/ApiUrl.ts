export const apiURL = (path: string): string => {
  const useLocal = false
  return (useLocal ? "http://localhost:8080/api/" : "https://wikiverse-api-main-febfewcbf3avfffh.canadacentral-01.azurewebsites.net/api/") + path;
}