interface RequiredLabelProps {
  children: React.ReactNode;
  error?: string;
}

export const RequiredLabel = ({ children, error }: RequiredLabelProps) => (
  <div>
    <label className="block text-sm font-normal text-black mb-1 font-sans">
      {children} <span className="text-red-500">*</span>
    </label>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);