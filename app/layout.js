import './globals.css';
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

export const metadata = {
  title: 'AQ Beauty Hub | Luxury Skincare',
  description: 'Premium beauty collection crafted for radiant elegance.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#f4f9f8] via-[#eaf4f2] to-[#dcf0ee] text-gray-900 antialiased min-h-screen selection:bg-[#78a59b] selection:text-white">
        <CartProvider>
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}