import { Button } from "@/components/ui/button";
import { FC } from "react";
import { FileSpreadsheetIcon, EyeClosedIcon, EyeClosed, MoonIcon, SunIcon, LogOut, UserIcon } from "lucide-react";
import { ThemeMode } from "@/lib/types";
import EthiopianFlag from "./EthiopianFlag";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const isStaff = user?.isStaff || false;
  
  return (
    <header className="bg-[#2c3e50] px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-white text-xl font-semibold flex items-center">
        <EthiopianFlag /> Ethiopian Construction Authority
      </h1>
      <div className="flex space-x-2 items-center">
        {/* Only show form toggle to staff */}
        {isStaff && (
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
        )}
        
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
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary text-white">
              <UserIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.fullName}
              {isStaff && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Staff</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
