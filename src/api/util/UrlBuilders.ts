export function LocalAPI(path: string): string {
  const LocalAPI = "http://localhost:8080/api/";
  return LocalAPI + path;
}