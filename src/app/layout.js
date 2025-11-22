import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ProductProvider } from "../context/ProductContext";
import { CartProvider } from "../context/CartContext";
import { MessageProvider } from "../context/MessageContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatWindow from "../components/ChatWindow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Auto Parts Marketplace",
  description: "The premier marketplace for buying and selling auto parts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <MessageProvider>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Suspense fallback={<div style={{ height: '80px', borderBottom: '1px solid #eee' }}></div>}>
                    <Header />
                  </Suspense>
                  <main style={{ flex: 1 }}>
                    {children}
                  </main>
                  <Footer />
                  <ChatWindow />
                </div>
              </MessageProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
