export const metadata = {
  title: 'Background Remover',
  description: 'Remove backgrounds from product photos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
