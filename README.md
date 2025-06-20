# Order App Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🎨 Design & Theme

- **UI Framework**: Material UI (MUI)
- **Theme**: Blue and White color scheme
- **Styling**: Tailwind CSS for additional styling needs

## 📋 Coding Conventions

### 🏗️ Architecture Principles

**Keep It Simple**: This project follows a straightforward approach focused on maintainability and consistency.

### 📁 Component Structure

- **Page-Level Components**: Each page has its own dedicated components
- **No Shared Components**: Avoid creating common/shared components to maintain page isolation
- **Self-Contained Logic**: All logic for a page stays within that page's components
- **Material UI First**: Use Material UI components directly in pages, no need for separate component files

### 🔧 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **HTTP Client**: Axios (centralized client)
- **Authentication**: Centralized auth handling
- **Styling**: Tailwind CSS + MUI theme

### 📂 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page (redirects to login/dashboard)
│   ├── login/             # Login page
│   │   └── page.tsx       # Login page with all logic
│   ├── dashboard/         # Dashboard page
│   │   └── page.tsx       # Dashboard page with all logic
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # Client providers (MUI theme)
├── lib/                   # Utilities and configurations
│   ├── axios.ts          # Centralized axios client
│   ├── auth.ts           # Authentication utilities
│   └── theme.ts          # MUI theme configuration
└── types/                 # TypeScript type definitions
```

### 🎯 Development Guidelines

1. **Page Isolation**: Each page should be self-contained with all its logic
2. **API Calls**: Use the centralized axios client for all API requests
3. **Authentication**: Handle auth through the centralized auth utilities
4. **Styling**: Use MUI components with blue/white theme, Tailwind for custom styling
5. **TypeScript**: Use strict typing for all components and functions
6. **File Naming**: Use kebab-case for file names, PascalCase for components
7. **No Component Files**: Put everything directly in page files using Material UI

## 🚀 Getting Started

### Environment Setup

1. Create a `.env.local` file in the root directory:
```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier
- `npm run validate` - Run all validation checks

## 🎨 Theme Configuration

The project uses a blue and white theme with Material UI. Theme configuration can be found in `src/lib/theme.ts`.

## 🔐 Authentication

Authentication is handled centrally through utilities in `src/lib/auth.ts`. Currently supports:
- Login functionality
- Token storage and retrieval
- Logout functionality

## 🌐 API Integration

All API calls use the centralized axios client located in `src/lib/axios.ts`. Currently supports:
- Login endpoint: `POST /api/v1/users/login`

The backend URL is configured via the `NEXT_PUBLIC_API_URL` environment variable.

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
