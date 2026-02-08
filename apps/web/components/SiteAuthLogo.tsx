import Image from "next/image";
import React from "react";

const SiteAuthLogo = ({ size }: { size: number }) => {
  return (
    <Image
      src="/logo.png"
      alt="Bonny Vocational Center"
      width={size}
      height={size}
      className="object-contain"
    />
  );
};

export default SiteAuthLogo;
