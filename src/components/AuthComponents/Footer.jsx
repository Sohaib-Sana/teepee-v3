import React from "react";

export default function Footer() {
  return (
    <footer className="text-white mb-0 flex justify-center items-center bg-white">
      <div className="absolute bottom-5 pr-0 pl-0 w-[495px]">
        <div className="teepee-disclaimer text-black" style={{ fontSize: "12px" }}>
          <p>
            ⚠️ Please note: Teepee.ai is in early Beta. We’re refining our AI’s task generation and marking, so occasional inaccuracies may occur.
          </p>
        </div>
        <div className="flex mt-2">
          <div className="mr-4 text-black">© Teepee.ai. All rights reserved</div>
          <div className="mr-4">
            <a href="/about_us" target="_blank" rel="noopener noreferrer" className="text-black">
              About
            </a>
          </div>
          <div>
            <a href="https://teepee.ai/privacy-policy-for-teepee-ai/" target="_blank" rel="noopener noreferrer" className="text-black">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
