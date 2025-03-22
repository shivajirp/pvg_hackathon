import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Link href="/">
        <h1 className="text-3xl font-semibold">AgroVision</h1>
      </Link>
      <p className={cn("text-muted-foreground text-sm")}>{label}</p>
    </div>
  );
};

export default Header;
