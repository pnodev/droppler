import Logo from "~/assets/logo-large.svg";
import { cn } from "~/lib/utils";

export function Header() {
  return (
    <header className={cn("pt-4 w-full max-w-(--page-width) mx-auto")}>
      <div className="h-[450px] bg-gradient-to-b from-[hsla(225,42%,42%,0.733)] to-[hsla(225,47%,26%,0)] absolute"></div>
      <img src={Logo} alt="Droppler" className="w-64" />
    </header>
  );
}
