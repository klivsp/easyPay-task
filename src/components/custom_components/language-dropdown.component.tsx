import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import i18n from "@/i18n/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LanguagesDropdown = () => {
  const [activeLanguage, setActiveLanguage] = useState(i18n.language || "en");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="dark:bg-slate-800">
        <Button variant="default" size="sm" className="gap-2">
          <Globe className="h-4 w-4 text-black" />
          <span className="text-black">
            {activeLanguage.toLocaleUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem
          onClick={() => {
            setActiveLanguage("en");
            i18n.changeLanguage("en");
          }}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setActiveLanguage("sq");
            i18n.changeLanguage("sq");
          }}
        >
          Shqip
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguagesDropdown;
