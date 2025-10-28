# Viewing the Latest Dashboard Changes

The finance dashboard implementation lives in this Git repository. To review or reuse the modified code, you have two primary options:

1. **Inspect the committed diff locally**
   ```bash
   git show HEAD
   ```
   This command prints the most recent commit that replaced the starter template with the dashboard UI, including the updated Angular component files.

   The application code now lives in the nested `MRA/` directory. When you want to inspect individual files, reference them with that prefix:
   ```bash
   git diff HEAD^ HEAD -- MRA/src/app/app.html
   git diff HEAD^ HEAD -- MRA/src/app/app.ts
   git diff HEAD^ HEAD -- MRA/src/app/app.scss
   ```
   Adjust the file paths as needed to inspect other files.

2. **Open the project in VS Code**
   Clone the repository (or copy the project directory) and open it in VS Code. The committed files already contain the implemented dashboard, so you do **not** need to manually paste code. Instead, simply open the files inside the `MRA/` folder (for example `MRA/src/app/app.html`, `MRA/src/app/app.scss`, and `MRA/src/app/app.ts`) to see the latest version.

If you push this repository to a remote service such as GitHub, the same commit will be available there. On the web interface you can browse the files or open the commit to view the diff.
