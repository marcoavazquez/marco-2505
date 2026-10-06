import type { ComponentProps, ReactNode } from "react";

export type CardTitleLevel = "h1" | "h2" | "h3" | "h4";
export type CardTitleAlign = "left" | "center";

export interface CardProps extends Omit<ComponentProps<"div">, "title"> {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  titleLevel?: CardTitleLevel;
  titleAlign?: CardTitleAlign;
}

const baseClassName =
  "w-full rounded-lg border border-border bg-background p-6 shadow-sm";

const headerClassName = "mb-6 flex flex-col gap-1";

const titleClasses: Record<CardTitleLevel, string> = {
  h1: "text-xl font-bold",
  h2: "text-lg font-bold",
  h3: "text-base font-semibold",
  h4: "text-sm font-semibold",
};

const titleAlignClasses: Record<CardTitleAlign, string> = {
  left: "text-left",
  center: "text-center",
};

const descriptionClassName = "text-sm text-zinc-500 dark:text-zinc-400";

export function Card({
  children,
  title,
  description,
  titleLevel = "h2",
  titleAlign = "left",
  className,
  ...divProps
}: CardProps) {
  const Title = titleLevel;
  const hasHeader = Boolean(title) || Boolean(description);

  return (
    <div {...divProps} className={`${baseClassName} ${className ?? ""}`.trim()}>
      {hasHeader && (
        <div className={headerClassName}>
          {title && (
            <Title
              className={`${titleClasses[titleLevel]} ${titleAlignClasses[titleAlign]}`}
            >
              {title}
            </Title>
          )}
          {description && <p className={descriptionClassName}>{description}</p>}
        </div>
      )}

      {children}
    </div>
  );
}
