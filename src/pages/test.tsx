import { Avatar, IconButton } from "@mui/material";
import React from "react";

function test() {
  return (
    <div className="grid gap-5">
      <div className="relative w-full h-56 bg-[url('/bg.jpg')] bg-no-repeat bg-right bg-contain before:bg-red before:absolute before:top-0 before:left-0 before:content-[''] before:w-full before:h-full">
        <IconButton sx={{ p: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src={"/profile.png"}
            sx={{ p: 0, width: "195px", height: "195px" }}
          />
        </IconButton>
      </div>
      <div className="relative w-full h-56 before:bg-[url('/classroom.png')] before:content-[' '] before:absolute before:bg-cover before:top-0 before:left-0 before:w-full before:h-full before:bg-repeat-x before:bg-right before:opacity-30 shadow-[inset_0_0_0_2000px_rgba(124,197,185,1)]">
        <IconButton sx={{ p: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src={"/profile.png"}
            sx={{ p: 0, width: "195px", height: "195px", opacity: "100%" }}
          />
        </IconButton>
      </div>
      <div className="relative w-full h-56 bg-[url('/edat_logo.png')] bg-no-repeat bg-right bg-contain shadow-[inset_0_0_0_2000px_rgba(124,197,185,1)]">
        <IconButton sx={{ p: 0, width: "195px", height: "195px" }}>
          <Avatar
            alt="Remy Sharp"
            src={"/profile.png"}
            sx={{ p: 0, width: "195px", height: "195px" }}
          />
        </IconButton>
      </div>
    </div>
  );
}

export default test;
