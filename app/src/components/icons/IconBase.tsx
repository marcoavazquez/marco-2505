import type { ReactNode, SVGProps } from "react";

type IconBaseProps = SVGProps<SVGSVGElement> & {
  children: ReactNode;
};

const IconBase = ({ children, ...props }: IconBaseProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
};

export default IconBase;
