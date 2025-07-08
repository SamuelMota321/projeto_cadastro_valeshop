export const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-normal text-black mb-1 font-sans">
    {children} <span className="text-red-500">*</span>
  </label>
);