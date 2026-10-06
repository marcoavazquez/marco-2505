import Image from "next/image";

export function SnailAvatar({ className = "size-12" }: { className?: string }) {
  return (
    <Image
      src="/snail-avatar.svg"
      alt="Avatar de caracol"
      width={128}
      height={128}
      className={`shrink-0 rounded-full ${className}`}
    />
  );
}
