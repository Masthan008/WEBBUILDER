# 📸 Editor Visual Guide - Lovable/Bolt Style

## 🎨 New Layout Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back    My Website ✏️    Saved 2 mins ago    ↶ ↷  🎨 📦 ✨ 🔌   │
│                                                   📋 ⬇️ 🐙 🚀 Deploy │
├────────────────────────────────┬────────────────────────────────────┤
│                                │                                    │
│  📄 index.html        💬       │  Preview  🖥️ 📱 📲  🔄  ⛶         │
│ ┌──────────────────────────┐  │ ┌──────────────────────────────┐  │
│ │ 1  <!DOCTYPE html>       │  │ │                              │  │
│ │ 2  <html>                │  │ │    [Live Website Preview]    │  │
│ │ 3    <head>              │  │ │                              │  │
│ │ 4      <title>...</title>│  │ │    - Desktop view            │  │
│ │ 5    </head>             │  │ │    - Tablet view             │  │
│ │ 6    <body>              │  │ │    - Mobile view             │  │
│ │ 7      <h1>Hello</h1>    │  │ │                              │  │
│ │ 8    </body>             │  │ │    OR                        │  │
│ │ 9  </html>               │  │ │                              │  │
│ │                          │  │ │    [AI Chat Interface]       │  │
│ │  [Monaco Code Editor]    │  │ │    - Ask AI questions        │  │
│ │  - Syntax highlighting   │  │ │    - Modify website          │  │
│ │  - Line numbers          │  │ │    - Get suggestions         │  │
│ │  - Auto-complete         │  │ │                              │  │
│ │  - Minimap               │  │ │    Toggle with 💬 button     │  │
│ └──────────────────────────┘  │ └──────────────────────────────┘  │
│                                │                                    │
│  50% Width                     │  50% Width                         │
└────────────────────────────────┴────────────────────────────────────┘
```

---

## 🔝 Top Bar Breakdown

```
┌─────────────────────────────────────────────────────────────────────┐
│  [←]  [My Website ✏️]  [Saved 2 mins ago]  │  [↶][↷]  [🎨][📦][✨]  │
│  Back   Edit Title      Timestamp          │  Undo Redo  Tools      │
│                                             │  [🔌][📋][⬇️][🐙][🚀]  │
│                                             │  More Tools + Deploy   │
└─────────────────────────────────────────────────────────────────────┘
```

### Left Section:
- **← Back**: Navigate to Dashboard
- **Title**: Click pencil to edit
- **Timestamp**: Last saved time

### Right Section:
- **↶ ↷**: Undo/Redo (Ctrl+Z, Ctrl+Y)
- **🎨**: Theme picker
- **📦**: Component library
- **✨**: Animation library
- **🔌**: Integrations hub
- **📋**: Copy code
- **⬇️**: Download HTML
- **🐙**: Export to GitHub
- **🚀**: Deploy website

---

## 💻 Code Editor Panel (Left)

```
┌────────────────────────────────┐
│  📄 index.html        💬       │  ← Header
├────────────────────────────────┤
│ 1  <!DOCTYPE html>             │
│ 2  <html lang="en">            │
│ 3    <head>                    │
│ 4      <meta charset="UTF-8">  │
│ 5      <title>My Site</title>  │
│ 6      <style>                 │
│ 7        body {                │
│ 8          margin: 0;          │
│ 9          font-family: sans;  │
│10        }                     │
│11      </style>                │
│12    </head>                   │
│13    <body>                    │
│14      <h1>Hello World</h1>    │
│15    </body>                   │
│16  </html>                     │
│                                │
│  [Monaco Editor Features]      │
│  - Dark theme                  │
│  - Syntax highlighting         │
│  - Auto-complete               │
│  - Line numbers                │
│  - Minimap (right side)        │
│  - Word wrap                   │
│  - Real-time editing           │
└────────────────────────────────┘
```

### Features:
- **File Name**: Shows "index.html"
- **Chat Toggle**: 💬 button to switch right panel
- **Monaco Editor**: Professional code editor
- **Real-time**: Changes apply instantly
- **History**: Auto-saves to undo/redo

---

## 🖥️ Preview Panel (Right)

### Preview Mode:
```
┌────────────────────────────────┐
│  Preview  [🖥️][📱][📲] 🔄 ⛶   │  ← Header
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │   [Website Preview]      │ │
│  │                          │ │
│  │   - Desktop (100%)       │ │
│  │   - Tablet (768px)       │ │
│  │   - Mobile (375px)       │ │
│  │                          │ │
│  │   Responsive preview     │ │
│  │   with device frames     │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
└────────────────────────────────┘
```

### Chat Mode (Toggle):
```
┌────────────────────────────────┐
│  Preview  [🖥️][📱][📲] 🔄 ⛶   │  ← Header
├────────────────────────────────┤
│                                │
│  User: Make the header blue    │
│  ┌──────────────────────────┐ │
│  │ Make the header blue     │ │
│  └──────────────────────────┘ │
│                                │
│  AI: I'll change the header... │
│  ┌──────────────────────────┐ │
│  │ I'll change the header   │ │
│  │ color to blue for you.   │ │
│  └──────────────────────────┘ │
│                                │
│  [Ask AI to modify...]  [Send] │
└────────────────────────────────┘
```

### Header Controls:
- **Preview**: Label
- **🖥️**: Desktop view
- **📱**: Tablet view
- **📲**: Mobile view
- **🔄**: Rotate orientation
- **⛶**: Full screen

---

## 🎯 Device Preview Modes

### Desktop Mode:
```
┌────────────────────────────────┐
│  [🖥️] 📱 📲                    │
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │  Full width preview        │ │
│ │  No device frame           │ │
│ │  100% width                │ │
│ │                            │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### Tablet Mode (Portrait):
```
┌────────────────────────────────┐
│  🖥️ [📱] 📲  🔄                │
├────────────────────────────────┤
│      ┌──────────────┐          │
│      │              │          │
│      │  768x1024    │          │
│      │  Portrait    │          │
│      │  With frame  │          │
│      │              │          │
│      └──────────────┘          │
└────────────────────────────────┘
```

### Mobile Mode (Portrait):
```
┌────────────────────────────────┐
│  🖥️ 📱 [📲]  🔄                │
├────────────────────────────────┤
│         ┌────────┐             │
│         │        │             │
│         │ 375x   │             │
│         │ 667    │             │
│         │ Port   │             │
│         │        │             │
│         └────────┘             │
└────────────────────────────────┘
```

---

## 🔄 Workflow Examples

### 1. Edit Code Directly:
```
1. Type in code editor (left)
   ↓
2. See changes in preview (right)
   ↓
3. Changes auto-save to history
   ↓
4. Use Undo/Redo if needed
```

### 2. Use AI Chat:
```
1. Click 💬 button in code header
   ↓
2. Right panel switches to chat
   ↓
3. Ask AI: "Make the button bigger"
   ↓
4. AI updates code automatically
   ↓
5. Click 💬 again to see preview
```

### 3. Test Responsiveness:
```
1. Click 🖥️ for desktop view
   ↓
2. Click 📱 for tablet view
   ↓
3. Click 📲 for mobile view
   ↓
4. Click 🔄 to rotate orientation
   ↓
5. Click ⛶ for full screen test
```

### 4. Navigate Back:
```
1. Click ← Back button (top-left)
   ↓
2. Returns to Dashboard
   ↓
3. All changes are saved
```

---

## 🎨 Color Scheme

### Background Colors:
- **Main**: `bg-black` (#000000)
- **Panels**: `bg-black/80` (80% opacity)
- **Borders**: `border-white/10` (10% white)
- **Hover**: `hover:bg-white/10`

### Text Colors:
- **Primary**: `text-white` (#FFFFFF)
- **Secondary**: `text-zinc-400` (#A1A1AA)
- **Muted**: `text-zinc-500` (#71717A)

### Accent Colors:
- **Deploy**: `from-indigo-500 to-purple-500`
- **Success**: `text-green-500`
- **Warning**: `text-yellow-500`

---

## 📱 Responsive Behavior

### Desktop (>1024px):
- Split view: 50% code, 50% preview
- All buttons visible
- Full feature set

### Tablet (768px-1024px):
- Split view maintained
- Some buttons may stack
- Full functionality

### Mobile (<768px):
- **Future**: Stack vertically or tabs
- **Current**: Optimized for desktop
- **Note**: Mobile editor coming soon

---

## 🎯 Key Interactions

### Keyboard Shortcuts:
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Ctrl+Shift+Z**: Redo (alternative)
- **Enter**: Submit chat message
- **Escape**: Cancel title editing

### Mouse Actions:
- **Click title**: Edit website name
- **Click 💬**: Toggle chat/preview
- **Click device icons**: Change preview mode
- **Click ←**: Go back to dashboard

---

## 🚀 Comparison with Lovable/Bolt

### Layout Match:
```
Lovable/Bolt:          StackStudio:
┌──────┬──────┐       ┌──────┬──────┐
│ Code │ Prev │       │ Code │ Prev │
│      │      │       │      │ or   │
│      │      │       │      │ Chat │
└──────┴──────┘       └──────┴──────┘
   ✅ Match!              ✅ Match!
```

### Features Match:
- ✅ Split-view layout
- ✅ Monaco editor
- ✅ Real-time preview
- ✅ Device modes
- ✅ Clean UI
- ✅ Professional look

### Unique Additions:
- ✅ Undo/Redo history
- ✅ Theme picker
- ✅ Component library
- ✅ Animation library
- ✅ Integrations hub
- ✅ One-click deploy

---

## 🎊 Summary

The new Editor provides a **professional, Lovable/Bolt-style interface** with:

1. **Split-view layout** - Code and preview side-by-side
2. **Always-editable code** - Monaco editor always visible
3. **Integrated AI chat** - Toggle between preview and chat
4. **Back button** - Easy navigation to dashboard
5. **Device preview** - Test responsive designs
6. **Professional UI** - Clean, modern, intuitive

**The Editor now looks and feels like a professional development tool!** 🚀
