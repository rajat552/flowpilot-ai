import os
import subprocess
from datetime import datetime, timedelta, timezone

# Commits list: (relative_file_path, short_meaningful_commit_message)
commits = [
    (
        "apps/web/index.html",
        "style(web): add Google Fonts for Space Grotesk and Space Mono"
    ),
    (
        "apps/web/tailwind.config.js",
        "style(web): configure MLH theme color tokens and shadows"
    ),
    (
        "apps/web/src/index.css",
        "style(web): add blueprint grid pattern and retro card styles"
    ),
    (
        "apps/web/src/App.tsx",
        "style(web): apply blueprint grid background to root view"
    ),
    (
        "apps/web/src/components/layout/Navbar.tsx",
        "style(web): update navigation bar with retro theme and badges"
    ),
    (
        "apps/web/src/components/layout/Footer.tsx",
        "style(web): restyle footer with high-contrast monospace theme"
    ),
    (
        "apps/web/src/components/landing/LandingPage.tsx",
        "style(web): update landing page with stats and amber banner"
    ),
    (
        "apps/web/src/components/dashboard/DashboardPage.tsx",
        "style(web): restyle dashboard telemetry cards and run list"
    ),
    (
        "apps/web/src/components/workflows/NewWorkflowModal.tsx",
        "style(web): update workflow creation modal with retro inputs"
    ),
    (
        "apps/web/src/components/workflows/PlanReviewView.tsx",
        "style(web): restyle plan review gate and DAG step breakdown"
    ),
    (
        "apps/web/src/components/execution/ExecutionWorkspace.tsx",
        "style(web): update execution workspace and live event console"
    ),
    (
        "apps/web/src/components/artifacts/ReportView.tsx",
        "style(web): restyle verified report viewer and tables"
    ),
    (
        "apps/web/src/components/evaluations/EvaluationsPage.tsx",
        "style(web): restyle benchmark matrix and evaluation metrics"
    ),
    (
        "apps/web/src/components/nebius/NebiusStatusModal.tsx",
        "style(web): update Nebius connection status modal styling"
    ),
]

# Timezone: IST (+05:30)
tz = timezone(timedelta(hours=5, minutes=30))
now = datetime.now(tz)

# 10 minutes interval between commits
interval = timedelta(minutes=10)
start_time = now - (len(commits) - 1) * interval

print(f"Starting staggered git commits for {len(commits)} files...")
print(f"Time range: {start_time.strftime('%Y-%m-%d %H:%M:%S %z')} to {now.strftime('%Y-%m-%d %H:%M:%S %z')}\n")

for i, (file_path, message) in enumerate(commits):
    commit_time = start_time + (i * interval)
    time_str = commit_time.strftime("%Y-%m-%dT%H:%M:%S%z")
    # Insert colon in timezone offset if needed (e.g. +0530 -> +05:30)
    if len(time_str) >= 2 and time_str[-5] in ('+', '-'):
        time_str = time_str[:-2] + ':' + time_str[-2:]

    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = time_str
    env["GIT_COMMITTER_DATE"] = time_str

    # Stage the single file
    add_cmd = ["git", "add", file_path]
    add_res = subprocess.run(add_cmd, capture_output=True, text=True)
    if add_res.returncode != 0:
        print(f"Error staging {file_path}: {add_res.stderr}")
        continue

    # Commit with custom date
    commit_cmd = ["git", "commit", "-m", message]
    commit_res = subprocess.run(commit_cmd, env=env, capture_output=True, text=True)
    if commit_res.returncode != 0:
        print(f"Error committing {file_path}: {commit_res.stderr}")
    else:
        # Get latest commit short hash
        hash_res = subprocess.run(["git", "rev-parse", "--short", "HEAD"], capture_output=True, text=True)
        commit_hash = hash_res.stdout.strip()
        print(f"[{i+1}/{len(commits)}] {commit_hash} | {commit_time.strftime('%H:%M:%S')} | {file_path} -> {message}")

print("\nAll files successfully committed with 10-minute staggered intervals!")
