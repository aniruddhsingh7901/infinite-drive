'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({ 
  children, 
  className = '', 
  onClick,
  type = 'button',
  ...props 
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}