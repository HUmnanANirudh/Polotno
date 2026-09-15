import Link from 'next/link';
import { CloudShader } from '../landing/Cloud';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — Cloud Shader Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <CloudShader speed={1} count={6} />
        </div>
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply z-0" />
        
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            zIndex: 1
          }}
        />

        {/* Brand content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-blue-600 rounded-sm" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Polotno</span>
          </Link>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Design without<br />
            boundaries.
          </h1>
          <p className="text-lg text-blue-100/80 max-w-md leading-relaxed">
            Create, collaborate, and bring your visual ideas to life with a canvas that works the way you think.
          </p>
        </div>
      </div>

      {/* Right — Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile-only branding */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Polotno</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
