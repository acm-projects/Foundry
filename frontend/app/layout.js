import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/provider";
import { AppProvider } from "@/globalStates/projectName";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Foundry",
  description: "Simplify AWS Deployment",
};

export default function RootLayout({ children }) {
  return (
    <Provider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>

    </Provider>
  );
}
