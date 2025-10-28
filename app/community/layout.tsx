import Navbar from "../(protected)/_components/navbar";

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <Navbar/>
    {children}
    </>
  );
}
