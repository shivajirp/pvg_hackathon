import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import Hero from "./_components/Hero";
import { Feature } from "./_components/Services";

const RootPage = () => {
  return (
    <MaxWidthWrapper>
      <Hero />
      <Feature />
    </MaxWidthWrapper>
  );
};

export default RootPage;
