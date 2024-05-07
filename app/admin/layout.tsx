import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css"
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div>
      <ModalProvider />
      {children}
      <Toaster />
    </div>
  );
}
