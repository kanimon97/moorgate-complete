# Git Commands Reference

## Initial Setup

### Configure Git (First Time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Initialize a Repository
```bash
git init                                    # Create new git repo in current folder
```

## Basic Workflow

### Check Status
```bash
git status                                  # See what files changed
git log                                     # View commit history
git log --oneline                          # Compact commit history
git log --oneline -n 5                     # Show last 5 commits
```

### Stage & Commit Changes
```bash
git add .                                   # Stage all changes
git add filename.txt                        # Stage specific file
git add folder/                             # Stage entire folder
git commit -m "Your commit message"         # Commit staged changes
git commit -am "Message"                    # Stage and commit tracked files in one step
```

### View Changes
```bash
git diff                                    # See unstaged changes
git diff --staged                           # See staged changes
git diff filename.txt                       # See changes in specific file
```

## Branching

### Create & Switch Branches
```bash
git branch                                  # List all local branches
git branch -a                               # List all branches (local + remote)
git branch branch-name                      # Create new branch
git checkout branch-name                    # Switch to branch
git checkout -b branch-name                 # Create and switch to new branch
git branch -M new-name                      # Rename current branch
git branch -d branch-name                   # Delete branch (safe)
git branch -D branch-name                   # Force delete branch
```

### Merge Branches
```bash
git merge branch-name                       # Merge branch-name into current branch
git merge --abort                           # Cancel merge if conflicts
```

## Remote Repository

### Connect to Remote
```bash
git remote add origin https://github.com/username/repo.git    # Add remote
git remote -v                                                  # View remotes
git remote remove origin                                       # Remove remote
git remote set-url origin https://github.com/username/repo.git # Change remote URL
```

### Push to Remote
```bash
git push origin branch-name                 # Push branch to remote
git push -u origin branch-name              # Push and set upstream
git push origin --delete branch-name        # Delete remote branch
git push --force                            # Force push (use carefully!)
```

### Pull from Remote
```bash
git pull                                    # Fetch and merge from remote
git pull origin branch-name                 # Pull specific branch
git fetch                                   # Download remote changes (no merge)
git fetch --all                             # Fetch all remotes
```

### Clone Repository
```bash
git clone https://github.com/username/repo.git              # Clone repo
git clone https://github.com/username/repo.git folder-name  # Clone into specific folder
```

## Undo Changes

### Unstage Files
```bash
git reset filename.txt                      # Unstage file (keep changes)
git reset                                   # Unstage all files
```

### Discard Changes
```bash
git checkout -- filename.txt                # Discard changes in file
git restore filename.txt                    # Discard changes (newer syntax)
git restore --staged filename.txt           # Unstage file
git clean -fd                               # Remove untracked files and folders
```

### Undo Commits
```bash
git reset --soft HEAD~1                     # Undo last commit, keep changes staged
git reset --mixed HEAD~1                    # Undo last commit, keep changes unstaged
git reset --hard HEAD~1                     # Undo last commit, discard changes
git revert commit-hash                      # Create new commit that undoes changes
```

## Stashing (Temporary Save)

```bash
git stash                                   # Save changes temporarily
git stash save "description"                # Save with description
git stash list                              # List all stashes
git stash pop                               # Apply and remove latest stash
git stash apply                             # Apply latest stash (keep it)
git stash drop                              # Delete latest stash
git stash clear                             # Delete all stashes
```

## Tags

```bash
git tag                                     # List tags
git tag v1.0.0                              # Create lightweight tag
git tag -a v1.0.0 -m "Version 1.0"         # Create annotated tag
git push origin v1.0.0                      # Push tag to remote
git push origin --tags                      # Push all tags
git tag -d v1.0.0                           # Delete local tag
git push origin --delete v1.0.0             # Delete remote tag
```

## Useful Shortcuts

### View Information
```bash
git show                                    # Show latest commit details
git show commit-hash                        # Show specific commit
git blame filename.txt                      # See who changed each line
git reflog                                  # View all reference changes
```

### Search
```bash
git grep "search term"                      # Search in tracked files
git log --grep="search term"                # Search commit messages
git log --author="name"                     # Filter commits by author
```

## Remove Git Completely

```bash
# Windows
rmdir /s /q .git

# Mac/Linux
rm -rf .git
```

## Common Workflows

### Start New Project and Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

### Create Feature Branch
```bash
git checkout -b feature-name
# Make changes
git add .
git commit -m "Add feature"
git push -u origin feature-name
```

### Update Your Branch with Latest Main
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

### Fix Merge Conflicts
```bash
# After git merge or git pull shows conflicts:
# 1. Open conflicted files and resolve conflicts
# 2. Remove conflict markers (<<<<, ====, >>>>)
git add .
git commit -m "Resolve merge conflicts"
```

### Sync Fork with Original Repo
```bash
git remote add upstream https://github.com/original/repo.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Tips

- **Commit often**: Small, focused commits are easier to manage
- **Write clear messages**: Describe what and why, not how
- **Pull before push**: Always pull latest changes before pushing
- **Use branches**: Keep main/master stable, work in feature branches
- **Check status**: Run `git status` frequently to know what's happening
- **Don't commit secrets**: Never commit API keys, passwords, or sensitive data

## Emergency Commands

### Accidentally Committed to Wrong Branch
```bash
git reset --soft HEAD~1                     # Undo commit, keep changes
git stash                                   # Save changes
git checkout correct-branch                 # Switch to correct branch
git stash pop                               # Apply changes
git add .
git commit -m "Your message"
```

### Pushed Wrong Code
```bash
git revert HEAD                             # Create new commit that undoes last commit
git push origin branch-name                 # Push the revert
```

### Lost Commits After Reset
```bash
git reflog                                  # Find lost commit hash
git checkout commit-hash                    # Go to that commit
git checkout -b recovery-branch             # Create branch from it
```
