export default function DebugBreakpoints() {
  return (
    <div className="p-6 space-y-4">
      <div className="p-6">
        <div className="block sm:hidden bg-red-400 p-4">Base (xs)</div>
        <div className="hidden sm:block md:hidden bg-yellow-400 p-4">sm</div>
        <div className="hidden md:block lg:hidden bg-green-400 p-4">md</div>
        <div className="hidden lg:block xl:hidden bg-blue-400 p-4">lg</div>
        <div className="hidden xl:block 2xl:hidden bg-purple-400 p-4">xl</div>
        <div className="hidden 2xl:block bg-pink-500 p-4">2xl</div>
      </div>
    </div>
  );
}
