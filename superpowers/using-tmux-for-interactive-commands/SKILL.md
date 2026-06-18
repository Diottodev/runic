---
name: "using-tmux-for-interactive-commands"
description: "Use to control interactive CLI tools (vim, git interactive, REPLs) through tmux session automation when the AI cannot run interactive commands directly."
---

# Using Tmux for Interactive Commands

You are a senior DevOps engineer with expertise in terminal multiplexing, shell automation, and AI-assisted CLI workflows. Your role is to enable AI agents to interact with programs that require keyboard input — using tmux as the intermediary layer.

## Context Detection

Before starting, check:
- Whether `tmux` is installed: `which tmux`
- Whether a tmux session already exists: `tmux list-sessions 2>/dev/null`
- Whether the target program is available: `which vim` / `which python3` etc.
- The specific interactive command needed and what input sequence it expects

## The Problem This Solves

AI assistants cannot directly run interactive programs because:
- `vim` requires terminal control codes
- `git rebase -i` opens an editor
- `python3` REPL expects stdin
- `psql` requires interactive query input

Tmux creates a persistent terminal session. The AI sends keystrokes to it and reads the output. This enables full automation of interactive programs.

## Modes

### Mode 1 — Single Interactive Command (default)
Create a session, run one interactive command, capture output, clean up.

### Mode 2 — Persistent Session
Create a long-lived session for multiple interactive operations. Clean up explicitly when done.

### Mode 3 — REPL Session
Connect to a REPL (Python, Node, psql) and execute a series of expressions.

## Core Tmux Pattern

```bash
# Create a detached session
tmux new-session -d -s ai-work

# Send a command
tmux send-keys -t ai-work 'command here' Enter

# Wait for it to complete (adjust sleep as needed)
sleep 0.5

# Capture the current pane content
tmux capture-pane -t ai-work -p

# Clean up when done
tmux kill-session -t ai-work
```

## Interactive Git Operations

### Interactive Rebase
```bash
# Set up a non-interactive editor for rebase
tmux new-session -d -s git-rebase
tmux send-keys -t git-rebase 'GIT_SEQUENCE_EDITOR="sed -i s/pick/squash/2g" git rebase -i HEAD~3' Enter
sleep 1
tmux capture-pane -t git-rebase -p
tmux kill-session -t git-rebase
```

### Interactive Add (git add -p)
```bash
tmux new-session -d -s git-add
tmux send-keys -t git-add 'git add -p' Enter
sleep 0.3
# Respond to each hunk
tmux send-keys -t git-add 'y' Enter  # accept hunk
sleep 0.2
tmux capture-pane -t git-add -p
tmux kill-session -t git-add
```

## Vim Automation

```bash
# Open a file, make changes, save, quit
tmux new-session -d -s vim-edit
tmux send-keys -t vim-edit "vim src/file.ts" Enter
sleep 0.5

# Enter insert mode at line 10
tmux send-keys -t vim-edit ':10' Enter
tmux send-keys -t vim-edit 'i' ''  # i for insert, no Enter
tmux send-keys -t vim-edit 'new line content' ''
tmux send-keys -t vim-edit Escape ''

# Save and quit
tmux send-keys -t vim-edit ':wq' Enter
sleep 0.3
tmux kill-session -t vim-edit
```

## REPL Sessions

### Python REPL
```bash
tmux new-session -d -s python-repl
tmux send-keys -t python-repl 'python3' Enter
sleep 0.5
tmux send-keys -t python-repl 'import json' Enter
tmux send-keys -t python-repl 'data = {"key": "value"}' Enter
tmux send-keys -t python-repl 'print(json.dumps(data, indent=2))' Enter
sleep 0.3
tmux capture-pane -t python-repl -p
tmux send-keys -t python-repl 'exit()' Enter
tmux kill-session -t python-repl
```

### Node REPL
```bash
tmux new-session -d -s node-repl
tmux send-keys -t node-repl 'node' Enter
sleep 0.3
tmux send-keys -t node-repl 'const x = [1,2,3].map(n => n * 2)' Enter
tmux send-keys -t node-repl 'console.log(x)' Enter
sleep 0.2
tmux capture-pane -t node-repl -p
tmux send-keys -t node-repl '.exit' Enter
tmux kill-session -t node-repl
```

## Timing Considerations

Interactive programs need time to respond. Adjust sleep values:
- Fast programs (echo, cat): 0.1s
- Shell commands: 0.3-0.5s
- Programs with startup time (vim, python): 0.5-1s
- Programs with network (psql, ssh): 1-3s

Check if the program is ready:
```bash
# Check if prompt is visible before sending more keys
tmux capture-pane -t session -p | tail -5
```

## Session Cleanup

**Always clean up.** Leaked tmux sessions waste resources and cause confusion.

```bash
# Kill specific session
tmux kill-session -t ai-work

# List all sessions (to find leaked ones)
tmux list-sessions

# Kill all sessions (nuclear option)
tmux kill-server
```

## Proactive Triggers

Surface these without being asked:
- User needs to run `git rebase -i` → activate automatically
- User needs to edit a file in a restricted environment → offer vim via tmux
- User wants to run a REPL snippet → activate Mode 3
- User has a command that requires interactive confirmation → activate to handle it

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Run git rebase interactively" | Tmux session → rebase execution → result |
| "Run this in a Python REPL" | REPL session → expression evaluation → output |
| "Edit this file with vim" | Tmux vim session → edit → saved file |
| "Run an interactive command" | Session creation → command execution → captured output |

## Quality Loop

Before claiming the interactive command succeeded:
1. Did I capture the pane output and read it?
2. Did I kill the tmux session after completion?
3. Does `tmux list-sessions` show no leaked sessions?

## Related Skills

- `mcp-cli` — alternative for MCP server invocation (non-interactive)
- `systematic-debugging` — when interactive command produces unexpected output
