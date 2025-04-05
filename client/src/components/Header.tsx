import { Button } from "@/components/ui/button";
import { FC } from "react";
import { LightbulbIcon, FileSpreadsheetIcon, EyeClosedIcon, EyeClosed, MoonIcon, SunIcon } from "lucide-react";
import { ThemeMode } from "@/lib/types";
import EthiopianFlag from "./EthiopianFlag";

interface HeaderProps {
  isFormVisible: boolean;
  theme: ThemeMode;
  onToggleForm: () => void;
  onToggleTheme: () => void;
  onExportCsv: () => void;
}

const Header: FC<HeaderProps> = ({
  isFormVisible,
  theme,
  onToggleForm,
  onToggleTheme,
  onExportCsv
}) => {
  return (
    <header className="bg-[#2c3e50] px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-white text-xl font-semibold flex items-center">
        <EthiopianFlag /> Ethiopian Construction Authority
      </h1>
      <div className="flex space-x-2">
        <Button
          variant="default"
          onClick={onToggleForm}
          className="bg-[#3498db] hover:bg-[#2980b9] text-white"
        >
          {isFormVisible ? (
            <>
              <EyeClosedIcon className="mr-2 h-4 w-4" /> Hide Form
            </>
          ) : (
            <>
              <EyeClosed className="mr-2 h-4 w-4" /> Show Form
            </>
          )}
        </Button>
        
        <Button
          variant="default"
          onClick={onExportCsv}
          className="bg-[#3498db] hover:bg-[#2980b9] text-white"
        >
          <FileSpreadsheetIcon className="mr-2 h-4 w-4" /> Export CSV
        </Button>
        
        <Button
          variant="secondary"
          onClick={onToggleTheme}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          {theme === 'light' ? (
            <>
              <SunIcon className="mr-2 h-4 w-4" /> Light
            </>
          ) : (
            <>
              <MoonIcon className="mr-2 h-4 w-4" /> Dark
            </>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
