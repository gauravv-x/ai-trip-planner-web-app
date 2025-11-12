<h1 align="center"> 🌍 AI Trip Planner — Smart AI Travel Assistant</h1>

[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-skyblue.svg)](https://tailwindcss.com/)
[![Mapbox](https://img.shields.io/badge/Mapbox-Integrated-blue.svg)](https://www.mapbox.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![OpenRouter](https://img.shields.io/badge/AI-OpenAI%2FGemini-green.svg)](#)

> ✈️ **AI Trip Planner** is a conversational web app that helps users plan personalized trips using AI.  
> It intelligently understands your travel preferences, generates itineraries, and visualizes routes — all on an interactive world map.

---

<h2 align="center">🎬 Project Demo</h2>

<p align="center">
  <a href="https://drive.google.com/file/d/1s-PIRNGu0IVdXWiERlsDjwHi4yjvcPrW/view" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1_v4GrrcWyxjdhGJdJtMKOXbKcFs2alev" 
         alt="AI-Trip Planner Demo Video" width="700" style="border-radius: 10px;">
  </a>
</p>

<p align="center">
  ▶️ Click the image above to watch the full <b>AI Trip Planner Demo Video</b> hosted on Google Drive.
</p>

---

## 🖼️ Screenshots  

| Home Page | Trip Chat Interface | Trip View |
|------------|---------------------|-----------|
| ![Home](https://drive.google.com/uc?export=view&id=1_v4GrrcWyxjdhGJdJtMKOXbKcFs2alev) | ![Chat](https://drive.google.com/uc?export=view&id=1dLEBI-mZO9c2xUB9__yCakm4vnyRsFc4) | ![My Trip](https://drive.google.com/file/d/1nGI0yMlr3sSj0tlRmxq9xALSVDB1qrzc/view?usp=sharing) |
  

---

## 🧠 Project Overview  

**AI Trip Planner** redefines travel planning by allowing users to simply *talk* to an AI assistant.  
Instead of manually searching, users can describe their dream trip — and the AI generates an itinerary, shows locations on a map, and provides personalized suggestions.  

This app combines **Gemini/OpenAI**’s intelligence with **Mapbox** visualization and a sleek **Next.js UI**.

---

## 🎯 Key Features  

- 🤖 **AI-Powered Trip Generation** — converts plain English questions into full itineraries.  
- 🗺️ **Dynamic Map Integration** — destinations displayed interactively using Mapbox.  
- 💬 **Smart Chat System** — smooth, reactive chat with context and auto-scroll.  
- 🧳 **Custom Itinerary Building** — multi-day plan suggestions with activities.  
- 💾 **Trip Data Persistence** — Convex DB integration for saving trip details.  
- 🎨 **Modern Responsive UI** — built with TailwindCSS and Next.js App Router.  
- 🔐 **Environment Security** — all API keys stored in `.env.local`.  

---

## 🏗️ Architecture  

```
┌─────────────────────┐    ┌──────────────────────┐    ┌───────────────────┐
│   Frontend (Next.js)│◄──►│   API Routes Layer   │◄──►│ AI Engin (OpenAI) │
└─────────────────────┘    └──────────────────────┘    └───────────────────┘
           │                            │
           ▼                            ▼
┌──────────────────────────┐   ┌────────────────────────┐
│  Map Rendering (Mapbox)  │   │   Convex DB Storage    │
└──────────────────────────┘   └────────────────────────┘
```

---

## 🚀 Quick Start  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/gauravv-x/ai-trip-planner-web-app.git
cd ai-trip-planner-web-app
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Set Up Environment Variables  
Create a `.env.local` file in the root:  
```env
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key
OPENROUTER_MODEL=your_model_name
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_PLACE_API_KEY=your_googleplace_api_key
ARCJET_KEY=your_arcject_api_key
CLERK_SECRET_KEY=your_clark_key
OPENROUTER_API_KEY=openrouter_api_key
NEXT_PUBLIC_CONVEX_URL=your_convex_api_key
```

### 4️⃣ Run the Development Server  
```bash
npm run dev
```

Visit:  
```
http://localhost:3000
```

### 5️⃣ Build for Production  
```bash
npm run build
npm start
```

---

## 📁 Project Structure  

```
ai-trip-planner-web-app/
├── app/
│   ├── create-new-trip/        # Trip planning workflow
│   ├── _components/            # Shared components
│   ├── api/                    # API routes (AI + DB)
│   └── layout.tsx              # Root layout file
├── components/                 # UI components (Hero, ChatBox, Footer)
├── public/                     # Static assets & images
├── lib/                        # API and utility functions
├── styles/                     # Global and Tailwind CSS files
├── .env.local.example          # Example environment file
├── package.json
├── next.config.js
└── README.md
```

---

## 🛠️ Technology Stack  

| Component | Technology | Purpose |
|------------|-------------|----------|
| **Framework** | Next.js 14 | React-based fullstack app |
| **Language** | TypeScript | Type-safe development |
| **Styling** | TailwindCSS | Responsive UI design |
| **AI** | Gemini / OpenAI APIs | Text understanding & itinerary generation |
| **Maps** | Mapbox GL JS | Route and location visualization |
| **Database** | Convex | Trip data persistence |
| **Hosting** | Vercel | Zero-config deployment |

---

## 🧩 Core Modules  

### 1️⃣ Hero Section  
- Eye-catching landing with background video  
- Showcases AI capabilities and CTA button  

### 2️⃣ Chatbox Interface  
- Fully reactive chat window  
- Scrolls automatically to new messages  
- Smart “suggestion chips” for quick replies  

### 3️⃣ Map Display (Mapbox)  
- Real-time destination visualization  
- Handles zoom, pan, and route overlays  

### 4️⃣ Trip Generation Logic  
- Converts plain English → AI query → structured itinerary  
- Displays day-wise plans and activities  

### 5️⃣ Footer  
- Rich, responsive footer  
- © Gaurav Akbari — All rights reserved  

---

## 🧰 Development Scripts  

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production files |
| `npm run start` | Run production server |
| `npm run lint` | Check and fix lint errors |

---

## 🚀 Deployment  

### ▶️ Deploy on **Vercel (Recommended)**  
1. Push repo to GitHub  
2. Go to [vercel.com](https://vercel.com/)  
3. Import repository  
4. Add environment variables  
5. Deploy 🚀  

### 🧱 Manual Deployment  
- Build command: `npm run build`  
- Start command: `npm start`  
- Node version: 18+  

---

## 🌍 Future Enhancements  

- 🏨 Integration with Flight & Hotel APIs  
- 📅 Editable Itinerary Calendar  
- 🧑‍🤝‍🧑 User Authentication & Trip Sharing  
- 💬 Voice-based Trip Queries  
- 🧭 Smart Budget Planner  

---

## 👨‍💻 Author  

**Gaurav Akbari**  
- 💼 Developer & Designer  
- 🌐 [GitHub Profile](https://github.com/gauravv-x)  
- 📧 gauravakbari007@gmail.com  

---

## 📄 License  

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer  

This application provides **AI-generated travel suggestions** for educational and exploration purposes.  
Always verify actual locations, travel requirements, and booking details before finalizing trips.

---

**Built with ❤️ by Gaurav Akbari — Empowering AI-Driven Travel Experiences** 🌎✈️  
