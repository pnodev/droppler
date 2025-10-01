import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import Logo from "~/assets/logo-large.svg";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { User } from "lucide-react";

export function Header() {
  return (
    <header
      className={cn(
        "pt-4 w-full max-w-(--page-width) mx-auto flex items-center justify-between"
      )}
    >
      <div className="h-[450px] bg-gradient-to-b from-[hsla(225,42%,42%,0.733)] to-[hsla(225,47%,26%,0)] absolute"></div>
      <Link to="/">
        <img src={Logo} alt="Droppler" className="w-64" />
      </Link>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>
            <User />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-10">
          <nav>
            <ul className="flex gap-3">
              <li>
                <NavigationLink to="/dashboard">Dashboard</NavigationLink>
              </li>
              <li>
                <NavigationLink to="/buckets">Buckets</NavigationLink>
              </li>
            </ul>
          </nav>
          <span className="bg-white/70 rounded-full flex p-0.5 shadow-2xl">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-10!",
                },
              }}
            />
          </span>
        </div>
      </SignedIn>
    </header>
  );
}

const NavigationLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      activeProps={{
        className:
          "text-white bg-black/40 font-medium rounded-md px-6 py-3 border-b-2 border-primary",
      }}
      activeOptions={{ exact: true }}
      className="text-white bg-black/40 font-medium rounded-md px-6 py-3"
      to={to}
    >
      {children}
    </Link>
  );
};
