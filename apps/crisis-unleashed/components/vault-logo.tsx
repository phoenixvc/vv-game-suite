export default function VaultLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 opacity-70 blur-md rounded-full"></div>
      <div className="relative flex items-center justify-center bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-full p-2 border-2 border-yellow-300/30">
        <div className="text-2xl">CU</div>
      </div>
    </div>
  )
}
