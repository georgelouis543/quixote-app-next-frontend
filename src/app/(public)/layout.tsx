export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-7xl">
         
        <div className="px-4 py-2 flex items-center justify-center">
            {children}
        </div>
        
    </div>
  )
}
