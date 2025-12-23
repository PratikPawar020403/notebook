# Interactive Academic Notebook

A beautiful, interactive digital notebook built with React and page-flip animations to showcase an academic journey. Designed to be embedded as a premium artifact in portfolios.

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Library**: `react-pageflip` (for realistic book turning effects)
- **Styling**: CSS Modules / Global CSS
- **Deployment**: Netlify

## 🚀 Deployment Info

This project is configured for **Netlify** deployment.

- **Deployment Root**: `/academic-notebook` (The web application lives in this folder)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18+ recommended

### Embedding (Iframe) support

This application is explicitly configured to allow embedding in iframes (e.g., inside a personal portfolio).
- `netty.toml` ensures `X-Frame-Options` and `Content-Security-Policy` headers allow this.
- `_redirects` handles SPA routing to prevent 404s inside iframes.

## 💻 Local Development

1. Open the terminal and navigate to the project root.
2. Enter the academic-notebook directory:
   ```bash
   cd academic-notebook
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗 Build for Production

To create a production build locally:

```bash
cd demo
npm run build
```

The output will be in `demo/dist`.

## 📂 Project Structure

- `demo/` - **Main Application Source** (Deploy this folder)
  - `src/` - React source code
  - `public/` - Static assets and redirects
  - `netlify.toml` - Netlify security configuration
