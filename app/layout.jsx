export const metadata = {
  title: 'Background Remover',
  description: 'Remove backgrounds from product photos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body style={{ margin: 0, background: '#ffffff' }}>
        {children}
      </body>
    </html>
  );
}

