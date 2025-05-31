# Bugfix Branches

Bugfix branches are used for fixing bugs or issues that have been identified in the application. Follow these steps when working on bugfixes.

## When to Create a Bugfix Branch.
- Create a bugfix branch when you need to address a specific bug or issue.
- Always branch from `dev`.
- Use descriptive names for the feature branch (e.g., `bugfix/fix-login-error`, `bugfix/fix-form-validation`).

## Work on a Bugfix Branch.

1. **Switch to the `dev` branch.**
    ```bash
    git checkout dev

2. **Pull the latest changes.**
    ```bash
    git pull origin dev

3. **Create a new bugfix branch.**
    ```bash
    git checkout -b bugfix/<bug-name>

4. **Fix the bug and commit changes.**
    ```bash
    git commit -m "[ team-name:patch ] Example commit."

5. **Push your bugfix branch to the remote repository.**
    ```bash
    git push origin bugfix/<bug-name>

6. **Create a pull request to merge your bugfix branch into `dev` and remove bugfix/<bug-name>.**
