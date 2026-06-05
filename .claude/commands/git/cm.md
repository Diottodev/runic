# Commit (no push)

Stage all relevant changes and create a commit using the `git-commit` skill.

1. Run `git diff --staged` to see staged changes
2. If nothing staged, run `git status` and ask user what to stage
3. Apply the `git-commit` skill to generate a Conventional Commit message
4. Create the commit with the selected message
5. Confirm: "Committed as: `<message>`"

Do NOT push. Do NOT amend previous commits.
