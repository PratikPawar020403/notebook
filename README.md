# 📓 Interactive Academic Notebook

I built this interactive academic notebook to present my educational journey in a more personal and engaging way. Instead of displaying my qualifications in a conventional timeline, I wanted to recreate the familiar experience of flipping through a physical notebook.

Built with React, TypeScript, and Vite, the project combines page-turning animations with custom-designed academic pages. I also customized the original flipbook implementation to address interaction issues and make the experience work better with a scaled, responsive layout.

## ✨ What I Built

- **Interactive page flipping:** Explore my academic journey through realistic page-turning interactions.
- **Academic journey:** Discover my school, undergraduate, and postgraduate milestones.
- **Custom notebook design:** A personalized layout inspired by the notebooks I used during my school days.
- **Responsive layout:** The notebook adjusts its dimensions for mobile and desktop screens.
- **Navigation controls:** Flip pages using navigation buttons, keyboard arrows, or the page corners.
- **Portfolio integration:** Designed to be embedded in my main portfolio website using an iframe.

## 💡 Why I Built This

While building my portfolio website, I explored different ways to present my academic journey. I wanted something more personal and memorable than a traditional timeline or a list of qualifications.

I discovered a flip-notebook project on GitHub that inspired me to explore this idea. I used it as a starting point, then customized the design and functionality to create my own digital academic notebook — bringing back the familiar feeling of flipping through a notebook from my school days.

The result is an interactive way to explore my academic journey, combining nostalgia with a modern web experience.

## 🛠️ How I Built It

I built the project with React and TypeScript, using Vite for development and production builds.

The flipbook functionality uses the `page-flip` library. Beyond customizing the notebook's appearance and content, I implemented fixes for issues I encountered while integrating page-flip interactions with a scaled layout.

One of my main customizations is `patchPageFlipCoordinates()`, which adjusts pointer coordinates to account for scaling. I also modified cover-page interactions to prevent unwanted page curling and shifting.

The application includes responsive sizing, keyboard navigation, clickable index navigation, page indicators, and iframe height notifications to support integration with my portfolio.

### Tech Stack

- **React 18** — UI and component architecture
- **TypeScript** — Type-safe development
- **Vite** — Development server and production builds
- **page-flip** — Page-turning interactions
- **CSS** — Notebook styling, layout, and animations

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- Git installed

### Installation

Clone the repository:

```bash
git clone https://github.com/PratikPawar020403/notebook.git
cd notebook/academic-book
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display a local URL where you can explore the notebook.

### Production Build

To create a production build:

```bash
npm run build
```

The generated files will be available in the `dist` directory inside `academic-book`.

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```text
notebook/
├── academic-book/
│   ├── public/             # Public assets
│   ├── src/
│   │   ├── lib/            # Flipbook implementation and custom fixes
│   │   └── ...             # Pages, components, and academic content
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── README.md
└── ...
```

## 🖼️ Portfolio Integration

I designed the notebook to work as an embedded experience within my main portfolio website.

The application communicates its height to the parent window using `postMessage`, allowing the parent page to respond to notebook size changes when its iframe integration handles those messages.

The Netlify configuration includes iframe-related response headers:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "ALLOWALL"
    Content-Security-Policy = "frame-ancestors *"
```

These settings are intended to permit embedding. For a production deployment, I recommend restricting `frame-ancestors` to the specific portfolio domain and verifying the hosting platform's header behavior.

## 🙌 Acknowledgements

This project was inspired by a flip-notebook implementation I discovered on GitHub. I used it as a starting point and built upon it with my own design changes, academic content, and custom interaction fixes.

The project reflects my interest in creating web experiences that are not only functional, but also personal and memorable.

---

**Built with curiosity, code, and a little nostalgia.** 📖
