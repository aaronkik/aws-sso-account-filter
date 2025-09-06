import { type ComponentPropsWithRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithRef<'input'>>(({ className, ...props }, ref) => (
  <input
    className={twMerge(
      'w-full rounded-sm border border-transparent bg-slate-800 leading-6 placeholder:text-slate-500 focus:border-orange-400 focus:bg-transparent focus:ring-orange-400 focus:placeholder:text-slate-400',
      className,
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = 'Input';
