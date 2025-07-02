import { GitHubRepo } from './github-repo';

export interface GitHubRepoSearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}
