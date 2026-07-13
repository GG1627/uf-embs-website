# How To Git

Hi Mia! This is the basic Git workflow for working on this website.

The main idea is:

1. Work on your own branch.
2. Save your changes with a commit.
3. Push your branch to GitHub.
4. Open a Pull Request to merge your work into `main`.
5. Update your branch after `main` changes.

## 1. Make Your Own Branch

First, make sure you are on `main` and have the latest code:

```bash
git checkout main
git pull origin main
```

Then create your own branch:

```bash
git checkout -b mia
```

You only need to create the branch once.

After that, whenever you want to switch back to your branch:

```bash
git checkout mia
```

## 2. Work On Your Changes

Make your edits in VS Code like normal.

To check what files changed:

```bash
git status
```

## 3. Save Your Changes

When you are done with a set of changes:

```bash
git add .
git commit -m "Describe what you changed"
```

Example:

```bash
git commit -m "Update home page text"
```

## 4. Push Your Branch To GitHub

Push your branch:

```bash
git push origin mia
```

## 5. Make A Pull Request

Go to GitHub and make a Pull Request:

- From: `mia`
- Into: `main`

Why we do this:

- The website is deployed from the `main` branch.
- When `main` gets updated, the website automatically updates too.
- That is why we work on our own branch first, then make a Pull Request into `main`.
- Pushing straight to `main` usually does not work for this project, so use a Pull Request instead.

After the Pull Request is reviewed/approved, merge it into `main`.

## 6. Update Your Local Code After The PR Is Merged

After your Pull Request is merged, update your local `main`:

```bash
git checkout main
git pull origin main
```

Then go back to your branch:

```bash
git checkout mia
```

Bring the latest `main` changes into your branch:

```bash
git merge main
```

Now your branch is updated and you can keep working.

## Common Commands

Check what branch you are on:

```bash
git branch
```

Check what changed:

```bash
git status
```

Switch to main:

```bash
git checkout main
```

Switch to your branch:

```bash
git checkout mia
```

Push your branch:

```bash
git push origin mia
```

## Quick Workflow

Most of the time, the workflow is:

```bash
git checkout mia
git status
git add .
git commit -m "Describe what you changed"
git push origin mia
```

Then make a Pull Request on GitHub.
