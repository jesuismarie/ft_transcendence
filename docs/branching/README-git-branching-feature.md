# Feature Branches

## When to Create a Feature Branch
- Create a feature branch when starting a new feature.
- Always branch from `feature/staging`.
- Use descriptive names for the feature branch (e.g., `feature/login-page`, `feature/payment-integration`).

## Work on a Feature Branch

1. **Switch to the `feature/staging` branch**.
    ```bash
    git checkout feature/staging

2. **Pull the latest changes**.
    ```bash
    git pull origin feature/staging

3. **Create a new feature branch**.
    ```bash
    git checkout -b feature/<feature-name>

4. **Develop the feature and commit changes**.
    ```bash
    git commit -m "[ team-name:feature ] Add <feature-name>."

5. **Push your feature branch to the remote repository**.
   ```bash
   git push origin feature/<feature-name>

6. **Create a pull request to merge your feature branch into `feature/staging` and remove feature/<feature-name>.**: