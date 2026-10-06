import type { SVGProps } from "react";
import IconBase from "./IconBase";

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </IconBase>
  );
};
