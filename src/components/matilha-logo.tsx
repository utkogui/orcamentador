import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  height?: number;
  priority?: boolean;
  /** Usa <img> nativo — necessário para exportação PDF confiável */
  native?: boolean;
};

export function MatilhaLogo({
  className,
  height = 28,
  priority = false,
  native = false,
}: Props) {
  if (native) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/matilha/logo-matilha.png"
        alt="Matilha Estúdio"
        height={height}
        className={cn("proposal-logo block w-auto max-w-none", className)}
        style={{ height, width: "auto" }}
      />
    );
  }

  return (
    <Image
      src="/matilha/logo-matilha.png"
      alt="Matilha Estúdio"
      width={Math.round(height * 3.6)}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
      style={{ height, width: "auto" }}
    />
  );
}
