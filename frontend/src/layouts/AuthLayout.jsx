import { GraduationCap } from "lucide-react";
const APP_NAME = "Campus OS";
const COLLEGE_NAME = "College Management System";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-[2rem] shadow-card overflow-hidden">
        {/* Top Panel - Brand */}
        <div 
          className="relative px-8 pt-12 pb-10 flex flex-col items-center text-center"
          style={{
            backgroundImage: "linear-gradient(180deg, var(--brand-gradient-from) 0%, var(--brand-gradient-to) 100%)"
          }}
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            {/* Logo Placeholder - assuming they have their own, we use an icon for now or leave space */}
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-wide">{APP_NAME}</h1>
          <p className="text-sm text-white/80">{COLLEGE_NAME}</p>
          
          {/* Decorative curved bottom (optional, mimicking the screenshot's soft edges if needed) */}
        </div>

        {/* Bottom Panel - Form */}
        <div className="px-8 py-10 bg-white">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h2 className="text-2xl font-bold text-[#1A103C] mb-2">{title}</h2>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
        
        {/* Footer */}
        <div className="pb-8 text-center bg-white">
          <p className="text-xs text-muted-foreground font-medium">www.getflytechnologies.com</p>
        </div>
      </div>
      
      {/* Background blobs based on screenshot */}
      <div className="pointer-events-none fixed top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
    </div>
  );
}

export { AuthLayout };
