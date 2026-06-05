# Create Pull Request

Create a GitHub PR for the current branch.

1. Run `git log --oneline main..HEAD` to see commits in this branch
2. Run `git diff main...HEAD` for full diff
3. Draft PR title (≤70 chars, imperative) and body:
   - Summary (2-3 bullets)
   - Test plan (what to verify)
4. Run `gh pr create --base main --title "..." --body "..."`
5. Return the PR URL

Default base branch: `main`. Ask if targeting a different branch.
