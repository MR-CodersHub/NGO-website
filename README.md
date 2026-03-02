# Jeevan Foundation - Design System

A modern, beautiful design system built with **Tailwind CSS v4**, featuring smooth animations, organic design elements, and a comprehensive set of utilities for building stunning web applications.

![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4.1.18-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🎨 **Custom Theme System**
- CSS custom properties (CSS variables) for easy theming
- Predefined color palette (Primary: `#F9A826`, Secondary: `#1F4F46`)
- Custom font families (Playfair Display for headings, Rubik for body)
- Responsive breakpoints

### ⚡ **Smooth Scrolling & Typography**
- Native smooth scroll behavior
- Optimized base typography with 1.7 line height
- Responsive heading sizes (h1-h6)
- Section spacing rhythm (3rem, 5rem, 8rem)

### 🎭 **Micro-Animation Utilities**

#### Ready-to-use animation classes:
- `.hover-lift` - Elevates element on hover with shadow
- `.fade-in-up` - Fades in from below on page load
- `.fade-in-up-delay-1/2/3` - Delayed fade-in variants
- `.btn-scale` - Interactive scale effect on hover/click
- `.pulse` - Continuous pulsing animation
- `.bounce` - Playful bouncing effect
- `.slide-in-left` - Slides in from left
- `.slide-in-right` - Slides in from right

### 🌊 **Organic Edge Effects**

#### SVG-based decorative elements:
- `.torn-edge-top` - Torn paper effect at top
- `.torn-edge-bottom` - Torn paper effect at bottom
- `.wavy-edge-top` - Wavy edge at top
- `.wavy-edge-bottom` - Wavy edge at bottom
- `.blob-shape` - Morphing blob shape
- `.mask-organic-1` - Organic mask pattern 1
- `.mask-organic-2` - Organic mask pattern 2

### 🎯 **Custom Components**

#### Buttons with ripple effects:
- `.btn-primary` - Primary button with hover effects
- `.btn-secondary` - Secondary button with hover effects
- Built-in ripple animation on click (via JavaScript)

### 🔮 **Additional Utilities**
- `.gradient-text` - Gradient text effect
- `.glass` - Glassmorphism effect with backdrop blur
- `.text-balance` - Balanced text wrapping

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start the Tailwind CSS watcher that automatically rebuilds your CSS when you make changes.

4. **Open `index.html` in your browser**
   - You can use a local server like Live Server (VS Code extension)
   - Or simply open the file directly in your browser

## 📁 Project Structure

```
jeevan-foundation/
├── src/
│   ├── css/
│   │   └── style.css          # Main CSS file with all custom styles
│   └── js/
│       └── main.js            # JavaScript for interactive features
├── public/
│   └── tailwind.css           # Compiled Tailwind CSS (auto-generated)
├── assets/
│   ├── icon/                  # Icons and favicons
│   ├── img/                   # Images
│   └── svg/                   # SVG files
├── index.html                 # Demo page showcasing all features
├── package.json               # Project dependencies
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── README.md                  # This file
```

## 🎨 Theme Customization

### CSS Variables (in `src/css/style.css`)

```css
@theme {
    /* Color Palette */
    --color-primary: #F9A826;
    --color-secondary: #1F4F46;
    --color-background: #F9FAF7;
    --color-text-primary: #1F2937;
    --color-text-muted: #6B7280;

    /* Font Families */
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Rubik', sans-serif;

    /* Section Spacing */
    --section-spacing-sm: 3rem;
    --section-spacing-md: 5rem;
    --section-spacing-lg: 8rem;

    /* Animation Timings */
    --transition-fast: 150ms;
    --transition-base: 300ms;
    --transition-slow: 500ms;
}
```

Simply modify these values to customize the entire design system!

## 📖 Usage Examples

### Hover Lift Card
```html
<div class="bg-white rounded-lg shadow p-6 hover-lift">
    <h3>Card Title</h3>
    <p>Card content with lift effect on hover</p>
</div>
```

### Fade In Animation
```html
<div class="fade-in-up">
    <h2>This fades in from below</h2>
</div>
```

### Organic Edges Section
```html
<section class="wavy-edge-top wavy-edge-bottom bg-white p-8">
    <h2>Section with wavy edges</h2>
</section>
```

### Gradient Text
```html
<h1 class="gradient-text">Beautiful Gradient Text</h1>
```

### Glass Morphism
```html
<div class="glass rounded-2xl p-8">
    <h3>Glass effect card</h3>
</div>
```

### Custom Buttons
```html
<button class="btn-primary btn-scale">Primary Button</button>
<button class="btn-secondary btn-scale">Secondary Button</button>
```

## 🔧 Development

### Build Commands

- **Development (watch mode)**
  ```bash
  npm run dev
  ```
  Watches for changes and rebuilds CSS automatically

- **Production Build**
  ```bash
  npx @tailwindcss/cli -i ./src/css/style.css -o ./public/tailwind.css --minify
  ```
  Creates a minified production build

## 🎯 JavaScript Features

The `main.js` file includes:
- **Intersection Observer** for scroll-triggered animations
- **Ripple effects** on button clicks
- **Smooth scrolling** for anchor links
- **Parallax effects** (optional, via data attributes)
- **Theme color logging** for debugging

### Adding Scroll Animations
```html
<div data-animate>
    This element will animate when scrolled into view
</div>
```

### Parallax Effect
```html
<div data-parallax="0.5">
    This element moves at 50% scroll speed
</div>
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - feel free to use this design system in your projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using Tailwind CSS v4**

## 🎓 Learning Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 🔮 Future Enhancements

- [ ] Dark mode support
- [ ] More animation presets
- [ ] Component library expansion
- [ ] Accessibility improvements
- [ ] Performance optimizations
- [ ] Additional organic shape variants
