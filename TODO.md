# Preorder Manager - TODO

## Module 1: Shared create/update form + persistence/navigation
- [ ] Add Prisma-backed server actions to create a preorder from form data
- [ ] Add Prisma-backed server actions to update a preorder by id from form data
- [ ] Add shared form shell component used by both create and edit routes (prefilled fields on edit)
- [ ] Add route: `app/preorders/new/page.js` (defaults + shared form shell)
- [ ] Add route: `app/preorders/[id]/page.js` (load preorder by id + shared form shell)
- [ ] Ensure UI matches existing app style: labels/helper text, save/cancel/back buttons, status switch
- [ ] Add loading state while saving (disable + “Saving…”)
- [ ] Verify form submission creates/updates data in SQLite and returns to `/`
- [ ] Run `npm run lint` (or available checks) and then `npm run build`

## Module 2: Visual polish / final verification
- [ ] Manually verify create/edit screens work end-to-end with status values and date fields
- [ ] Ensure edit prefill includes every field and uses correct types (dates, counts, enums)
