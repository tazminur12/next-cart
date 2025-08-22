import Providers from '@/components/Providers';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export const metadata = {
  title: 'NextCart - Your Shopping Destination',
  description: 'Discover amazing products at great prices with NextCart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
