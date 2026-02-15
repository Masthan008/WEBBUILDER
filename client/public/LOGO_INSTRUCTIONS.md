# Logo and Favicon Setup for StackStudio

## Required Files

Place your logo files in the `client/public/` directory:

### 1. Logo (PNG format recommended)
- **Filename**: `logo.png`
- **Recommended size**: 512x512px or 1024x1024px
- **Format**: PNG with transparent background
- **Usage**: Used as favicon and can be used in the app

### 2. Alternative Formats (Optional)
You can also add these for better browser support:

- `favicon.ico` - 32x32px ICO format (for older browsers)
- `logo-192.png` - 192x192px (for PWA)
- `logo-512.png` - 512x512px (for PWA)

## Current Setup

The `index.html` is configured to use:
```html
<link rel="icon" type="image/png" href="/logo.png" />
```

## How to Add Your Logo

1. Save your logo as `logo.png` in `client/public/`
2. Make sure it's a square image (1:1 aspect ratio)
3. PNG format with transparent background works best
4. The file will automatically be used as the favicon

## File Structure
```
client/
├── public/
│   ├── logo.png          ← Add your logo here
│   ├── favicon.ico       ← Optional: for older browsers
│   ├── logo-192.png      ← Optional: for PWA
│   └── logo-512.png      ← Optional: for PWA
└── index.html            ← Already configured
```

## Testing

After adding the logo:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh the page (Ctrl+F5)
3. Check the browser tab - you should see your logo as the favicon

## Notes

- The logo will appear in the browser tab
- Make sure the file is named exactly `logo.png` (lowercase)
- If you want to use the logo in the UI, you can import it:
  ```jsx
  import logo from '/logo.png'
  <img src={logo} alt="StackStudio" />
  ```
