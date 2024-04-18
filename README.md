# Keyscribe
UF Senior Design Project Repo

## Starting our Production Application
```bash
cd frontend
npm run build
cd ../backend
npm run build
npm run star
```

## Repo Workflow
- Development occurs locally on a feature branch.
- Your feature branch can be pushed to github using:
```bash
git push --set-upstream origin feature-branch-name
```
- When your feature works, submit a pull request to merge your changes to the dev branch. These will be reviewed by the team. Automatic testing and linting will occur for your pull request.
- The dev branch has all of the most recent changes and will be used as the "staging" environment.
- Periodically, stable changes will be merged to the main branch. This will be the "production" environment.

## To Setup Backend Locally
This section has been moved to the README in the backend directory.

