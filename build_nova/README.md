# Nova - Property Management Platform

A modern property management platform built with Next.js, TypeScript, and Supabase.

## Features

- 🏠 Property listing and search
- 🔍 Advanced filtering and sorting
- 🗺️ Interactive map view
- ❤️ Favorite properties
- 👤 User authentication
- 📱 Responsive design
- 🎨 Modern UI with shadcn/ui
- ✨ Smooth animations with Framer Motion
- 🌓 Dark mode support

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** Supabase
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Maps:** Google Maps API
- **Image Storage:** Cloudinary
- **Theme:** next-themes

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Maps API key
- Cloudinary account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nova.git
   cd nova
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Tailwind CSS and its dependencies:

   ```bash
   npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms @tailwindcss/typography tailwindcss-animate
   ```

4. Install theme dependencies:

   ```bash
   npm install next-themes
   ```

5. Initialize Tailwind CSS:

   ```bash
   npx tailwindcss init -p
   ```

6. Run the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nova/
├── app/
│   ├── auth/           # Authentication pages
│   ├── properties/     # Property-related pages
│   ├── favorites/      # Favorites page
│   └── search/         # Search page
├── components/
│   ├── properties/     # Property-related components
│   ├── ui/            # Reusable UI components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and configurations
├── types/            # TypeScript type definitions
└── public/           # Static assets
```

## Authentication

The application uses Supabase Auth for authentication with the following features:

- Email/password authentication
- Password reset functionality
- Protected routes
- Session management

## Theme Support

The application includes dark mode support using next-themes:

- Automatic system theme detection
- Manual theme switching
- Persistent theme preference
- Smooth theme transitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)
