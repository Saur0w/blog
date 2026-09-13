import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import styles from "./layout.module.scss";


export const metadata: Metadata = {
  title: {
    default: "Saurow — Creative Developer & Blog",
    template: "%s — Saurow",
  },
  description:
    "Documenting interactive digital experiences, creative coding, WebGL, shaders, and front-end engineering by Saurabh Thapliyal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Header />
        <div className={styles.shell}>
          <Sidebar />
          <main className={styles.mainArea}>
            {children}
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
