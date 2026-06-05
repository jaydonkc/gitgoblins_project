# Final Submission Checklist

This file maps the repository to the CSC 307 final deliverables.

## Required Links

| Deliverable | Link / Location | Status |
| --- | --- | --- |
| GitHub repository | <https://github.com/jaydonkc/gitgoblins_project> | Ready |
| GitHub Project board | <https://github.com/users/jaydonkc/projects/1/views/2> | Ready |
| Demo video | <https://youtu.be/HEyqqLtsCYw> | Ready |
| Running deployed app | <https://polite-sea-04f9f5310.7.azurestaticapps.net/> | Ready |
| Login/create-user instructions | [README.md](../README.md#login-instructions) | Ready |
| Final SRS | [docs/SRS.md](SRS.md) | Ready |
| UI prototype/storyboard | [docs/UI_PROTOTYPE.md](UI_PROTOTYPE.md), [PawPrint Figma prototype](https://www.figma.com/proto/3FXsFJZVXv26KCet3axnEQ/PawPrint?node-id=1-80&starting-point-node-id=1%3A80&t=o9IdVU9LA8iqE7MN-1) | Ready |
| Architecture and data model | [docs/ARCHITECTURE.md](ARCHITECTURE.md) | Ready |
| Final delivery runbook | [docs/FINAL_DELIVERY_RUNBOOK.md](FINAL_DELIVERY_RUNBOOK.md) | Ready |
| Azure CI/CD notes | [docs/AZURE_CICD.md](AZURE_CICD.md) | Ready |
| Coding standards | [CONTRIBUTING.md](../CONTRIBUTING.md) | Ready |
| Testing instructions | [README.md](../README.md#testing-and-verification) | Ready |

## Rubric Mapping

| Rubric item | Repository evidence |
| --- | --- |
| Project blurb | [README.md](../README.md) |
| Development environment setup | [README.md](../README.md#setup), [README.md](../README.md#running-locally) |
| Product behavior and user stories | [README.md](../README.md#current-product-behavior), [docs/SRS.md](SRS.md#2-user-stories), [docs/FINAL_DELIVERY_RUNBOOK.md](FINAL_DELIVERY_RUNBOOK.md#user-story-coverage) |
| UI prototype and storyboard | [docs/UI_PROTOTYPE.md](UI_PROTOTYPE.md) |
| UML/class/data model diagram | [docs/ARCHITECTURE.md](ARCHITECTURE.md#data-model) |
| Authentication/access control | [docs/ARCHITECTURE.md](ARCHITECTURE.md#access-control), `packages/express-backend/auth.js`, [SECURITY_BEHAVIOR.md](../SECURITY_BEHAVIOR.md) |
| CI/CD | [.github/workflows/ci-testing.yml](../.github/workflows/ci-testing.yml), [docs/AZURE_CICD.md](AZURE_CICD.md) |
| Testing | `cypress/e2e/jaydon-flows.cy.js`, `cypress/e2e/user-stories.cy.js`, `npm run test:e2e:all` |
| Security | [docs/ARCHITECTURE.md](ARCHITECTURE.md#api-design), [SECURITY_BEHAVIOR.md](../SECURITY_BEHAVIOR.md), `.env.example`, `.gitignore` |
| Software design and architecture | [docs/ARCHITECTURE.md](ARCHITECTURE.md), [README.md](../README.md#architecture) |

## Demo Script

Suggested 2-3 minute video flow:

1. Show homepage and saved preference controls.
2. Open a pet profile from the discovery feed.
3. Save a pet and show it on Favorites after refresh.
4. Submit an adoption inquiry as an adopter.
5. Log in as an organization account.
6. Show the shelter dashboard and update the inquiry status.
7. Create or edit a pet profile and show the photo gallery.

## Pre-Submission Verification

Run:

```bash
npm run verify
npm run test:e2e:stories
```

Run backend-backed Cypress only with a safe MongoDB test database:

```bash
npm run test:e2e
```

Confirm:

- `.env` contains real secrets only locally and is not committed.
- Canvas submission includes the demo video URL.
- Canvas submission includes the GitHub Project board URL.
- Canvas submission includes the deployed app URL and login/create-user instructions.
