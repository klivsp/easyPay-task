import cn from "classnames";
import LanguagesDropdown from "./language-dropdown.component";
import { useTranslation } from "react-i18next";

interface NavigationBarProps {
  className?: string;
}

const NavigationBar = ({ className }: NavigationBarProps) => {
  const { t } = useTranslation("common");

  const navItems = [
    { name: t("createTransaction"), path: "/" },
    { name: t("allTransactions"), path: "/all-transactions" },
    { name: t("statistics"), path: "/statistics" },
  ];
  return (
    <div
      className={cn(
        "w-full h-16 bg-gray-800 text-white flex items-center px-4 justify-between",
        className
      )}
    >
      <h2>{t("financeTracker")}</h2>
      <div>
        {navItems.map((item) => (
          <a key={item.name} href={item.path} className="mr-4">
            {item.name}
          </a>
        ))}
        <span className="text-black">
          <LanguagesDropdown />
        </span>
      </div>
    </div>
  );
};

export default NavigationBar;
