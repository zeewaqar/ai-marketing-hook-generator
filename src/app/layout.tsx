import './globals.css';            // Tailwind base + shadcn styles

export const metadata = {
  title: 'AI Marketing Hook Generator',
  description: 'Generate complete SEO & social-media copy in seconds',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
