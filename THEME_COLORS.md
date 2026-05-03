# 🎨 Theme Color Guide

## Quick Reference

### Main Colors

```css
/* Backgrounds */
--background: #0A0A0F;        /* Deep dark */
--card: #111118;              /* Card background */
--popover: #16161F;           /* Popover background */
--sidebar: #0E0E16;           /* Sidebar */

/* Primary (Teal) */
--primary: #00BFA5;           /* Main teal */
--gradient: linear-gradient(135deg, #00BFA5, #00A896);

/* Text */
--foreground: #E8E8F0;        /* Main text */
--muted: rgba(232, 232, 240, 0.5);  /* Muted text */

/* Borders */
--border: rgba(255, 255, 255, 0.07);  /* Subtle */
```

### Status Colors

```css
/* Priority */
.priority-critical { color: #00E5CC; }  /* Bright teal */
.priority-high     { color: #F87171; }  /* Red */
.priority-medium   { color: #FBB13C; }  /* Amber */
.priority-low      { color: #34D399; }  /* Green */

/* Task Status */
.status-todo        { color: rgba(232, 232, 240, 0.45); }
.status-in-progress { color: #FBB13C; }  /* Amber */
.status-in-review   { color: #26D0B8; }  /* Light teal */
.status-done        { color: #34D399; }  /* Green */
```

### Gradient Examples

```css
/* Teal Gradient (Primary) */
background: linear-gradient(135deg, #00BFA5, #00A896);

/* Light Teal Gradient */
background: linear-gradient(135deg, #00BFA5, #00E5CC);

/* Text Gradient */
background: linear-gradient(135deg, #00BFA5, #00E5CC);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Usage Examples

### Buttons

```tsx
/* Primary Button (Teal Gradient) */
<button className="btn-gradient px-4 py-2 rounded-lg text-white">
  Click Me
</button>

/* Ghost Button */
<button className="border border-white/10 bg-transparent hover:bg-white/5 px-4 py-2 rounded-lg">
  Cancel
</button>
```

### Cards

```tsx
/* Hover Card */
<div className="card-hover bg-card p-6 rounded-lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

/* Glowing Border Card */
<div className="glow-border bg-card p-6 rounded-lg">
  <h3>Special Card</h3>
</div>
```

### Badges

```tsx
/* Priority Badges */
<span className="priority-critical px-2 py-1 rounded text-xs font-medium">
  Critical
</span>
<span className="priority-high px-2 py-1 rounded text-xs font-medium">
  High
</span>
<span className="priority-medium px-2 py-1 rounded text-xs font-medium">
  Medium
</span>
<span className="priority-low px-2 py-1 rounded text-xs font-medium">
  Low
</span>

/* Status Badges */
<span className="status-todo px-2 py-1 rounded text-xs font-medium">
  To Do
</span>
<span className="status-in-progress px-2 py-1 rounded text-xs font-medium">
  In Progress
</span>
<span className="status-in-review px-2 py-1 rounded text-xs font-medium">
  In Review
</span>
<span className="status-done px-2 py-1 rounded text-xs font-medium">
  Done
</span>
```

### Text

```tsx
/* Gradient Text */
<h1 className="text-gradient text-4xl font-bold">
  Gradient Heading
</h1>

/* Muted Text */
<p className="text-muted-foreground">
  Secondary text
</p>
```

---

## Animation Classes

```tsx
/* Fade Up */
<div className="animate-fadeUp">
  Content fades up
</div>

/* Fade In */
<div className="animate-fadeIn">
  Content fades in
</div>

/* Slide In */
<div className="animate-slideIn">
  Content slides in
</div>

/* Pulse (for live indicators) */
<div className="pulse">
  Pulsing element
</div>

/* Glow (for special elements) */
<div className="animate-glow">
  Glowing element
</div>
```

---

## Color Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Deep Dark** | `#0A0A0F` | `10, 10, 15` | Main background |
| **Dark Gray** | `#111118` | `17, 17, 24` | Cards, panels |
| **Medium Dark** | `#16161F` | `22, 22, 31` | Popovers, dropdowns |
| **Sidebar Dark** | `#0E0E16` | `14, 14, 22` | Sidebar background |
| **Teal** | `#00BFA5` | `0, 191, 165` | Primary color |
| **Dark Teal** | `#00A896` | `0, 168, 150` | Gradient end |
| **Light Teal** | `#26D0B8` | `38, 208, 184` | Accents |
| **Bright Teal** | `#00E5CC` | `0, 229, 204` | Highlights |
| **Green** | `#34D399` | `52, 211, 153` | Success |
| **Amber** | `#FBB13C` | `251, 177, 60` | Warning |
| **Red** | `#F87171` | `248, 113, 113` | Error |
| **Pink** | `#EC4899` | `236, 72, 153` | Special |
| **Cyan** | `#22D3EE` | `34, 211, 238` | Info |
| **Light Text** | `#E8E8F0` | `232, 232, 240` | Main text |

---

## Opacity Variations

```css
/* Borders */
rgba(255, 255, 255, 0.07)  /* Subtle border */
rgba(255, 255, 255, 0.12)  /* Medium border */
rgba(0, 191, 165, 0.25)    /* Teal border hover */

/* Backgrounds */
rgba(255, 255, 255, 0.03)  /* Very subtle bg */
rgba(255, 255, 255, 0.05)  /* Subtle bg */
rgba(0, 191, 165, 0.12)    /* Teal bg */
rgba(0, 191, 165, 0.15)    /* Teal bg hover */

/* Text */
rgba(232, 232, 240, 0.35)  /* Very muted text */
rgba(232, 232, 240, 0.45)  /* Muted text */
rgba(232, 232, 240, 0.5)   /* Medium muted text */
```

---

## Shadow Examples

```css
/* Button Shadow */
box-shadow: 0 4px 16px rgba(0, 191, 165, 0.35);

/* Button Hover Shadow */
box-shadow: 0 6px 24px rgba(0, 191, 165, 0.5);

/* Card Shadow */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

/* Glow Effect */
box-shadow: 0 0 20px rgba(0, 191, 165, 0.3);

/* Strong Glow */
box-shadow: 0 0 30px rgba(0, 191, 165, 0.6);
```

---

## Complete Theme Variables

```css
:root {
  /* Backgrounds */
  --background: #0A0A0F;
  --foreground: #E8E8F0;
  --card: #111118;
  --card-foreground: #E8E8F0;
  --popover: #16161F;
  --popover-foreground: #E8E8F0;
  
  /* Primary */
  --primary: #00BFA5;
  --primary-foreground: #FFFFFF;
  
  /* Secondary */
  --secondary: #16161F;
  --secondary-foreground: #E8E8F0;
  
  /* Muted */
  --muted: #16161F;
  --muted-foreground: rgba(232, 232, 240, 0.5);
  
  /* Accent */
  --accent: #00BFA5;
  --accent-foreground: #FFFFFF;
  
  /* Destructive */
  --destructive: #F87171;
  
  /* Borders & Inputs */
  --border: rgba(255, 255, 255, 0.07);
  --input: rgba(255, 255, 255, 0.05);
  --ring: #00BFA5;
  
  /* Charts */
  --chart-1: #00BFA5;
  --chart-2: #34D399;
  --chart-3: #FBB13C;
  --chart-4: #F87171;
  --chart-5: #EC4899;
  
  /* Sidebar */
  --sidebar: #0E0E16;
  --sidebar-foreground: #E8E8F0;
  --sidebar-primary: #00BFA5;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: rgba(0, 191, 165, 0.15);
  --sidebar-accent-foreground: #26D0B8;
  --sidebar-border: rgba(255, 255, 255, 0.06);
  --sidebar-ring: #00BFA5;
}
```

---

## Quick Copy-Paste

### Teal Gradient Button
```html
<button class="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:transform hover:-translate-y-0.5" style="background: linear-gradient(135deg, #00BFA5, #00A896); box-shadow: 0 4px 16px rgba(0, 191, 165, 0.35);">
  Button Text
</button>
```

### Dark Card with Hover
```html
<div class="bg-[#111118] border border-white/[0.07] rounded-lg p-6 transition-all duration-250 hover:border-[#00BFA5]/25 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
  Card Content
</div>
```

### Gradient Text
```html
<h1 class="text-4xl font-bold" style="background: linear-gradient(135deg, #00BFA5, #00E5CC); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
  Gradient Heading
</h1>
```

