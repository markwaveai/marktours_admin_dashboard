import React, { useEffect } from "react";

const rotatingLogo = "./images/rotating_logo.png";

const splashbrand = "./images/splash_brand.png";



export default function Splash({ onFinish }) {







  // Close splash
  useEffect(() => {
    const t = setTimeout(() => onFinish(), 300);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-10">
          <div className="flex items-center justify-center">
            <img src={splashbrand} alt="" className="absolute mb-2 z-40 h-[110px] w-[110px] sm:w-[200px] sm:h-[200px]"/>
            <img 
              src={rotatingLogo} 
              alt="Logo" 
              className="w-72 h-72 sm:w-[500px] sm:h-[500px] object-contain animate-[spin_40s_linear_infinite]"
            />
          </div>

        </div>
     </div>
  );
}
