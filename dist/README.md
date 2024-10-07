# Deploying the Static Website to GitHub Pages

This README provides instructions on how to deploy the static website from the `dist` folder to GitHub Pages.

## Prerequisites

Ensure you have the following installed on your system:
- Node.js and npm
- Git

## Building the Project

Before deploying, you need to build the project to generate the necessary files in the `dist` folder.

1. Navigate to the root of the project directory in your terminal.
2. Run the following command to install the necessary dependencies:
   ```bash
   npm install
   ```
3. Build the project using the following command:
   ```bash
   npm run build
   ```
   This command will process the `src/tailwind.css` file and output the result to the `dist` folder.

## Deploying to GitHub Pages

Once the project is built, you can deploy it to GitHub Pages by following these steps:

1. Ensure you are on the main branch and have committed all your changes.
2. Create a new branch named `gh-pages`:
   ```bash
   git checkout -b gh-pages
   ```
3. Add the contents of the `dist` folder to the `gh-pages` branch:
   ```bash
   git add dist
   git commit -m "Deploy to GitHub Pages"
   ```
4. Push the `gh-pages` branch to your GitHub repository:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```
5. Go to your GitHub repository settings and enable GitHub Pages. Set the source to the `gh-pages` branch.

Your static website should now be live on GitHub Pages. You can access it at `https://<your-username>.github.io/<your-repository>/`.

## Notes

- Ensure that the `dist` folder is correctly configured to contain all the necessary files for the website.
- If you make changes to the source files, repeat the build and deploy steps to update the live site.

