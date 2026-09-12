import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import styles from "./layout.module.scss";


export const metadata: Metadata = {
  title: "Blog",
  description: "Blog layout structure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
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
