# Preorder Manager Agent

Build the Preorder Manager app with Next.js 16 and Prisma + SQLite.

## Scope
- Preorder list page with backend-driven filters, sorting, pagination, status toggle, delete, and row selection checkboxes.
- Create and update preorder page with prefilled values, save, cancel, and back navigation.
- Match the provided screenshots as closely as practical.

## Notes
- Keep state and data mutations backed by SQLite through Prisma.
- Prefer a clean, maintainable implementation with a single source of truth in the database.
- Show loading feedback during saves and refresh the list after mutations.
