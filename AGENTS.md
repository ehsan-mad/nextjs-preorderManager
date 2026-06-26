
```md
<!-- BEGIN:nextjs-agent-rules -->
# Preorder Manager Workspace Rules

This is a Next.js 16 app. Follow the repository structure and the actual framework behavior in this workspace, not generic Next.js assumptions.

## Project Rules
- Build the app with Next.js 16 and Prisma + SQLite.
- Keep all preorder data operations backed by the database.
- Do not fake filters, sorting, pagination, status changes, or deletes on the client only.
- Match the provided screenshots as closely as practical while keeping the code maintainable.

## Implementation Order
- Work in modules in this order: Prisma + SQLite, list screen, list interactions, shared create/update form, persistence/navigation, visual polish.
- Finish one module completely before starting the next.
- Every module must end with its own focused test pass.

## Module Test Gate Rule
- After completing a module, run the tests or checks that validate only that module’s functionality.
- Do not begin the next module until those module-specific tests pass.
- If a module fails its tests, fix that module first before moving forward.

## UI Rules
- Preserve the screenshot structure: list page, create button, tabs, sort menu, table, footer pagination, and form layout.
- Keep row checkboxes and select-all checkbox working.
- Status toggle, delete, create, and update must reflect the database state.
- Show loading feedback during saves and mutation feedback after toggle/delete actions.

## Code Quality Rules
- Prefer small, focused components over large page files.
- Keep shared logic in reusable modules.
- Use clear names and avoid duplicate query or form logic.
- Favor server-driven data fetching for the list page and route-driven navigation for create/edit screens.

## Validation Rules
- Run lint and build after implementation changes.
- Verify create, update, toggle, delete, filter, sort, pagination, and selection behavior.
- Confirm refreshed data matches the SQLite database after each mutation.

## Notes
- If any instruction conflicts with the user’s requirements, the user wins.
- Keep changes minimal, explicit, and easy to maintain.
<!-- END:nextjs-agent-rules -->
```
