import { type ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({ className, ...props }: ComponentProps<'button'>) => (
  <button
    className={twMerge(
      'inline-flex items-center justify-center rounded-sm bg-orange-400 px-4 py-1.5 text-base leading-6 font-medium text-slate-900 transition-colors duration-150 select-none hover:bg-orange-500 focus-visible:bg-orange-600 active:bg-orange-600',
      className,
    )}
    {...props}
  />
);

export default Button;
