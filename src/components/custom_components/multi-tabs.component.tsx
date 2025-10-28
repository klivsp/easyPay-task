import { cn } from "@/lib/utils";
import type { ReactElement, ReactNode } from "react";

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactElement;
  badge?: string | number;
}

interface SeparatedTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tabKey: T) => void;
  variant?: "default" | "pills" | "underline" | "header";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export function TabNavigation<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  variant = "pills",
  size = "md",
  fullWidth = true,
  className,
}: SeparatedTabsProps<T>) {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-xs";
      case "lg":
        return "px-6 py-3 text-base";
      default:
        return "px-4 py-2 text-sm";
    }
  };

  const getTabStyles = () => {
    const sizeStyles = getSizeStyles();

    switch (variant) {
      case "header":
        return {
          container: "flex rounded-xl bg-gray-800/30 p-1",
          tab: `${
            fullWidth ? "flex-1" : ""
          } rounded-lg ${sizeStyles} font-medium transition-all flex items-center justify-center gap-2`,
          activeTab: "bg-white text-gray-900 shadow-sm",
          inactiveTab: "text-gray-300 hover:text-white hover:bg-white/10",
        };
      case "pills":
        return {
          container: "flex rounded-xl bg-gray-200 p-1",
          tab: `${
            fullWidth ? "flex-1" : ""
          } rounded-lg ${sizeStyles} font-medium transition-all flex items-center justify-center gap-2`,
          activeTab: "bg-white text-gray-900 shadow-sm",
          inactiveTab: "text-gray-600 hover:text-gray-900",
        };
      case "underline":
        return {
          container: "flex border-b border-gray-200",
          tab: `${sizeStyles} font-medium transition-all border-b-2 border-transparent flex items-center gap-2`,
          activeTab: "text-blue-600 border-blue-600",
          inactiveTab:
            "text-gray-600 hover:text-gray-900 hover:border-gray-300",
        };
      default:
        return {
          container: "flex space-x-1",
          tab: `${sizeStyles} font-medium transition-all rounded-md flex items-center gap-2`,
          activeTab: "bg-blue-100 text-blue-700",
          inactiveTab: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        };
    }
  };

  const styles = getTabStyles();

  return (
    <div className={cn(styles.container, className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => !tab.disabled && onTabChange(tab.key)}
          disabled={tab.disabled}
          className={cn(
            styles.tab,
            activeTab === tab.key ? styles.activeTab : styles.inactiveTab,
            tab.disabled && "cursor-not-allowed opacity-50"
          )}
          type="button"
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge && (
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0.5 text-xs",
                variant === "header"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              )}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function TabContent<T extends string = string>({
  tabs,
  activeTab,
  className,
}: {
  tabs: TabItem<T>[];
  activeTab: T;
  className?: string;
}) {
  const activeTabContent = tabs.find((tab) => tab.key === activeTab)?.content;

  return <div className={className}>{activeTabContent}</div>;
}

export default function SeparatedTabs<T extends string = string>(
  props: SeparatedTabsProps<T> & {
    contentClassName?: string;
  }
) {
  const { contentClassName, ...navigationProps } = props;

  return (
    <div className="w-full">
      <TabNavigation {...navigationProps} />
      <TabContent
        tabs={props.tabs}
        activeTab={props.activeTab}
        className={cn("mt-6", contentClassName)}
      />
    </div>
  );
}
