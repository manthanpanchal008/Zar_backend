# ZAR Jewels - Premium Color Palette Guide

## 🎨 Official Brand Colors

### Primary Colors
| Element | Color | Hex | RGB | Usage |
|---------|-------|-----|-----|-------|
| Primary Gold | 🟨 | #D0B480 | 208, 180, 128 | Buttons, accents, highlights, primary CTAs |
| Luxury Black | ⬛ | #000000 | 0, 0, 0 | Sidebar background, text, premium feel |
| Title/Text | 🟫 | #A38274 | 163, 130, 116 | Headings, titles, elegant typography |
| Secondary Grey | ⚫ | #666666 | 102, 102, 102 | Secondary text, borders, disabled states |

### Background Colors
| Element | Color | Hex | RGB | Usage |
|---------|-------|-----|-----|-------|
| Cream Background | ⚪ | #F8F6F2 | 248, 246, 242 | Main content area background |
| White Cards | ⚪ | #FFFFFF | 255, 255, 255 | Card backgrounds, clean contrast |

### Status Colors
| Status | Color | Hex | RGB | Meaning |
|--------|-------|-----|-----|---------|
| Success | 🟢 | #2E7D32 | 46, 125, 50 | Success, approved, completed |
| Warning | 🟠 | #F9A825 | 249, 168, 37 | Warning, caution, attention |
| Error | 🔴 | #C62828 | 198, 40, 40 | Error, danger, critical |
| Info | 🔵 | #1565C0 | 21, 101, 192 | Info, notification, general |

---

## 📐 Component Guidelines

### Sidebar
```css
Background: #000000 (Black)
Active Menu: #D0B480 (Golden)
Icon Hover: #D0B480 (Golden)
Text: #FFFFFF (White)
Hover Background: rgba(208, 180, 128, 0.2)
Active Background: rgba(208, 180, 128, 0.15)
```

### Top Navbar
```css
Background: #FFFFFF (White)
Border Bottom: rgba(208, 180, 128, 0.2) (Soft Gold)
Page Heading: #A38274 (Title)
Notification Icons: #D0B480 (Golden)
Text: #000000 (Black)
```

### Primary Button
```css
Background: #D0B480 (Golden)
Text Color: #000000 (Black)
Hover: #A38274 (Title)
```

### Secondary Button
```css
Background: Transparent
Border: 1px solid #D0B480 (Golden)
Text Color: #D0B480 (Golden)
Hover: Background #D0B480, Text #000000
```

### Cards
```css
Background: #FFFFFF (White)
Border: 1px solid rgba(102, 102, 102, 0.08)
Top Border: 3px solid #D0B480 (Golden)
Header Background: rgba(208, 180, 128, 0.08)
```

### Main Content Area
```css
Background: #F8F6F2 (Cream)
Card Background: #FFFFFF (White)
```

---

## 🎯 CSS Variables (Available in Style Sheets)

```css
/* Main Colors */
--zar-golden: #D0B480;
--zar-black: #000000;
--zar-title: #A38274;
--zar-grey: #666666;
--zar-cream-bg: #F8F6F2;
--zar-white: #FFFFFF;

/* Light Variations */
--zar-golden-light: rgba(208, 180, 128, 0.15);
--zar-golden-lighter: rgba(208, 180, 128, 0.08);
--zar-golden-20: rgba(208, 180, 128, 0.2);
--zar-title-light: rgba(163, 130, 116, 0.15);
--zar-grey-light: rgba(102, 102, 102, 0.15);

/* Status Colors */
--zar-success: #2E7D32;
--zar-warning: #F9A825;
--zar-error: #C62828;
--zar-info: #1565C0;
```

---

## 💡 Usage Examples

### Heading
```html
<h1 class="text-title">Dashboard</h1>
<!-- Or directly: style="color: var(--zar-title)" -->
```

### Primary Button
```html
<button class="btn btn-primary">Save</button>
<!-- Background: #D0B480, Text: Black -->
```

### Success Alert
```html
<div class="alert alert-success">Success message</div>
<!-- Background: rgba(46, 125, 50, 0.1), Text: #2E7D32 -->
```

### Golden Accent
```html
<div class="text-golden">Highlighted Text</div>
<!-- Or: class="bg-golden" for background -->
```

### Status Badge
```html
<span class="badge badge-success">Active</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Inactive</span>
<span class="badge badge-info">New</span>
```

---

## 🎨 Design Philosophy

The ZAR Jewels color palette embodies:
- **Luxury**: Black sidebar and golden accents evoke premium jewelry
- **Elegance**: Warm earth tones create sophistication
- **Clarity**: High contrast for readability and accessibility
- **Trust**: Professional, cohesive color system
- **Accessibility**: Sufficient contrast ratios for WCAG compliance

---

## 📝 Notes

- All colors are defined in `/public/css/zar-colors.css`
- CSS variables are automatically loaded with Bootstrap overrides
- Status colors follow conventional UI patterns
- The cream background (#F8F6F2) is softer than pure white, reducing eye strain
- All golden accents have transparent variations for subtle effects

---

**Last Updated**: May 18, 2026
**File**: `/public/css/zar-colors.css`
