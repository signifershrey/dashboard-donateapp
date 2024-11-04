import "../styles/globals.css" 
import AuthProvider from "./components/AuthProvider";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for managing content",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
