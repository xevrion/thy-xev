export async function fetchRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}
