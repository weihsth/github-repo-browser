export interface GitHubRepo {
  id: number;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
}
