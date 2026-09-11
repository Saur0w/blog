import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import styles from "./layout.module.scss";


export const metadata: Metadata = {
  title: "Tutorials & Articles | Modern Web Design",
  description: "Explore website animations, interactions, and tutorials.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html lang="en">
      <body>
      <Header />
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.mainArea}>
          {children}
        </main>
      </div>
      </body>
      </html>
  );
}
