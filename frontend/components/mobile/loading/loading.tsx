'use client'

export default function LoadingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      
      {/* Video Circle */}
      <div className="w-[70vw] max-w-[320px] aspect-square rounded-full overflow-hidden bg-black">
        <video
          src="/videos/walk.mp4"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-sm tracking-[0.15em] uppercase opacity-70">
        Loading...
      </p>
    </main>
  )
}