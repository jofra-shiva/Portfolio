"use client";
import GitHubStats from '../../GitHubStats/GitHubStats';

export default function GitHubWindow({ info, commitsCount }: { info: any; commitsCount: number }) {
  return (
    <div className="win-github" style={{padding:'1rem'}}>
      <GitHubStats info={info} commitsCount={commitsCount} />
    </div>
  );
}
