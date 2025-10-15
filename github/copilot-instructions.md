
# GitHub Copilot Instructions

This file provides guidelines and best practices for using GitHub Copilot in this project.

---

## Project Information

**Project Name:** cap-alp
**Version:** 1.0.0
**Description:** A simple CAP project with xs-uaa and OData service
**Repository:** <Add your repository here>
**License:** UNLICENSED

### Main Technologies & Dependencies
- SAP CAP (Cloud Application Programming Model)
- Node.js
- Express
- SAP Cloud SDK
- UI5 Tooling
- ESLint
- TypeScript

### Key Folders
- `app/` – UI frontends
- `db/` – Domain models and data
- `srv/` – Service models and code

### Configuration Files
- `package.json` – Project metadata, dependencies, scripts
- `mta.yaml` – Multi-target application (MTA) deployment descriptor
- `.cdsrc-private.json` – CAP-specific and environment configuration
- `default.env.json` – Service runtime environment variables
- `eslint.config.mjs` – ESLint configuration

### Services & Bindings
- XSUAA service: `maxeda_alp-xsuaa-service`
- Destination service: `maxeda_alp-destination-service`

### Main Service
- `PosService` (OData, defined in `srv/pos-service.cds`)
- Custom logic in `srv/pos-service.js`

---

## Copilot Usage Guidelines
- Use Copilot for code suggestions, documentation, and boilerplate.
- Review all Copilot-generated code for accuracy and security before committing.
- Follow project-specific coding standards and naming conventions.

## Best Practices
- Validate Copilot suggestions against project requirements.
- Refactor and optimize generated code as needed.
- Avoid accepting large code blocks without understanding their logic.

## Troubleshooting
- If Copilot suggestions are irrelevant, provide more context or comments in your code.
- For configuration issues, check your Copilot extension settings in VS Code.

## Additional Resources
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [VS Code Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

---
This file is intended to help team members use GitHub Copilot effectively and responsibly within this project.