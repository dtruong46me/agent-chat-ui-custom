import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";


const inter = Inter({
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "ANNA Chat",
//   description: "Automation Network Nexus Assistant",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <NuqsAdapter>{children}</NuqsAdapter>
//       </body>
//     </html>
//   );
// }

export const metadata: Metadata = {
  title: "ANNA Custom Chat",
  description: "Automation Network Nexus Assistant - Powered by LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ---- BẮT ĐẦU CHỈNH SỬA ----
    // Xóa khoảng trắng và dấu xuống dòng giữa <html> và <body>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
    // ---- KẾT THÚC CHỈNH SỬA ----
  );
}