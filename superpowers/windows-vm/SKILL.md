---
name: "windows-vm"
description: "Use to create and manage a headless Windows 11 VM in Docker with KVM acceleration and SSH access for Windows-specific testing or operations."
---

# Windows VM

You are a senior infrastructure engineer with expertise in virtualization, Docker-based VM management, and cross-platform testing environments. Your role is to provision, connect to, and manage a headless Windows 11 VM that runs inside Docker with KVM acceleration.

## Context Detection

Before creating a VM, check:
- KVM availability: `ls /dev/kvm` (must exist)
- Docker installed and running: `docker version`
- Available memory: `free -h` (minimum 8GB RAM recommended)
- Available disk space: `df -h` (minimum 30GB for Windows image)
- Whether a Windows VM is already running: `docker ps | grep windows`

## Prerequisites

**Required:**
- Linux host with KVM support (`/dev/kvm` exists)
- Docker Engine (not Docker Desktop — needs KVM device access)
- 8GB+ RAM available
- 30GB+ disk space

**Verify:**
```bash
# Check KVM
ls -la /dev/kvm
# Expected: crw-rw---- 1 root kvm /dev/kvm

# Check Docker
docker version
docker info | grep -i storage

# Check memory
free -h
```

## Modes

### Mode 1 — Start VM (default)
Pull image and start a fresh Windows 11 VM container.

### Mode 2 — Connect to Running VM
SSH into an already-running VM.

### Mode 3 — Run Command
Execute a single command on the VM and return output.

### Mode 4 — Stop and Clean Up
Gracefully shut down the VM and remove the container.

## Mode 1 — Start VM

Using the `dockurr/windows` image (the standard headless Windows-in-Docker solution):

```bash
# Start Windows 11 VM with KVM acceleration
docker run -d \
  --name windows-vm \
  --device /dev/kvm \
  --cap-add NET_ADMIN \
  -p 2222:22 \
  -p 3389:3389 \
  -e VERSION="11" \
  -e USERNAME="user" \
  -e PASSWORD="pass" \
  -v windows-data:/storage \
  dockurr/windows

# Monitor startup (Windows takes 5-15 minutes first boot)
docker logs -f windows-vm
```

Wait for the log line: `Windows is ready` or `SSH server is now active`

```bash
# Verify SSH is available
while ! ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no user@localhost -p 2222 "echo ready" 2>/dev/null; do
  echo "Waiting for Windows SSH..."
  sleep 10
done
echo "Windows VM is ready"
```

## Mode 2 — Connect to Running VM

```bash
# Basic SSH connection
ssh -o StrictHostKeyChecking=no user@localhost -p 2222

# Run a single command
ssh -o StrictHostKeyChecking=no user@localhost -p 2222 "systeminfo | findstr /B /C:\"OS Name\""

# Copy a file to the VM
scp -P 2222 local-file.txt user@localhost:C:/Users/user/Desktop/

# Copy a file from the VM
scp -P 2222 user@localhost:"C:/Users/user/Desktop/output.txt" ./output.txt
```

## Mode 3 — Run Command

```bash
# Run PowerShell command
ssh -o StrictHostKeyChecking=no user@localhost -p 2222 "powershell -Command \"Get-Process | Select-Object Name, CPU | Sort-Object CPU -Descending | Select-Object -First 10\""

# Install a package via winget
ssh -o StrictHostKeyChecking=no user@localhost -p 2222 "powershell -Command \"winget install --id Git.Git -e --source winget\""

# Run a batch script
ssh -o StrictHostKeyChecking=no user@localhost -p 2222 "cmd /c dir C:\\"

# Run a .NET application
ssh -o StrictHostKeyChecking=no user@localhost -p 2222 "powershell -Command \"dotnet run --project C:/app\""
```

## Mode 4 — Stop and Clean Up

```bash
# Graceful shutdown
ssh -o StrictHostKeyChecking=no user@localhost -p 2222 "shutdown /s /t 30"

# Wait for shutdown, then remove container
sleep 35
docker stop windows-vm
docker rm windows-vm

# Remove persistent storage (if desired)
docker volume rm windows-data
```

## Common Use Cases

### Windows-Specific Testing
```bash
# Run a test suite on Windows
ssh user@localhost -p 2222 "cd C:/app && npm test"

# Test file path handling (backslashes, drive letters)
ssh user@localhost -p 2222 "powershell -Command \"Test-Path 'C:\\Users\\user\\Documents'\""
```

### Installing Development Tools
```bash
# Install Node.js
ssh user@localhost -p 2222 "winget install OpenJS.NodeJS -e"

# Install Python
ssh user@localhost -p 2222 "winget install Python.Python.3.11 -e"

# Install .NET SDK
ssh user@localhost -p 2222 "winget install Microsoft.DotNet.SDK.8 -e"
```

### RDP Access (if visual verification needed)
```bash
# Connect via RDP on port 3389
xfreerdp /v:localhost:3389 /u:user /p:pass /dynamic-resolution
# or use Remmina, Windows Remote Desktop client, etc.
```

## Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| `/dev/kvm: No such file` | KVM module | `modprobe kvm_intel` or `modprobe kvm_amd` |
| VM won't start | Memory | Reduce with `-e RAM_SIZE=4G` |
| SSH timeout | VM still booting | Wait longer, check `docker logs windows-vm` |
| No network in VM | Docker network | Add `--network bridge` |

## Proactive Triggers

Surface these without being asked:
- User needs to test Windows-specific behavior → activate
- User is debugging a path separator bug on Windows → activate for reproduction
- User needs to run a `.bat`, `.ps1`, or `.exe` → activate
- User has Windows-only dependencies → activate to test in isolation

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Start a Windows VM" | Container started, SSH available, connection verified |
| "Run X on Windows" | SSH command execution + output |
| "Test this on Windows" | VM startup → test execution → results |
| "Clean up the VM" | Graceful shutdown + container removal |

## Quality Loop

Before claiming the VM is ready:
1. Did `docker logs windows-vm` show "Windows is ready"?
2. Did the SSH connectivity check succeed?
3. Is port 2222 accessible?

Before cleaning up:
1. Are there any unsaved files or running processes on the VM?
2. Does the volume need to be preserved for next time?

## Related Skills

- `using-tmux-for-interactive-commands` — for interactive operations inside the VM
- `systematic-debugging` — when VM startup fails or commands produce unexpected results
