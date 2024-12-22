export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      <div className="fixed top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="fixed -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>
  );
}