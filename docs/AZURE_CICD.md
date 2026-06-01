# Azure CI/CD Setup

## CI

GitHub Actions runs `.github/workflows/ci-testing.yml` for pushes to `main` or `TE6_branch`, and for pull requests targeting `main`.

The CI job performs:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm test`

`npm run lint` checks both workspaces with ESLint and runs a Prettier check against the workflow and package metadata files.

## Backend CD

`.github/workflows/azure-backend-deploy.yml` deploys the Express workspace after the CI workflow passes on `main` or `TE6_branch`.

Required GitHub repository configuration:

- Repository variable `AZURE_BACKEND_APP_NAME`: Azure Web App name for the Express API, currently `gitgoblins-api-jaydonkc`.
- Repository secret `AZURE_BACKEND_PUBLISH_PROFILE`: publish profile downloaded from the Azure Web App.

Required Azure Web App application settings:

- `MONGODB_URI`: MongoDB Atlas connection string.
- `TOKEN_SECRET`: JWT signing secret.
- `MONGOOSE_DEBUG`: `false`.

The backend code listens on `process.env.PORT || 8000`, which is required for Azure App Service.

## Frontend CD

`.github/workflows/azure-static-web-apps.yml` deploys the Vite frontend after the CI workflow passes on `main` or `TE6_branch`.

Required GitHub repository configuration:

- Repository variable `AZURE_STATIC_WEB_APP_CONFIGURED`: set to `true` after the Static Web App exists.
- Repository variable `VITE_API_BASE_URL`: deployed backend URL, currently `https://gitgoblins-api-jaydonkc-bbbsbaeae4fhdfct.canadacentral-01.azurewebsites.net`.
- Repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN`: deployment token from the Azure Static Web App.

The Static Web Apps workflow uses:

- `app_location: "./packages/react-frontend"`
- `api_location: ""`
- `output_location: "dist"`
