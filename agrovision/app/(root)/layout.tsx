import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Navbar from "@/components/shared/Navbar";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper>
      <Navbar />
      {children}
    </MaxWidthWrapper>
  );
};

export default RootLayout;
