import { FC, useState } from "react";
import Header from "@/components/Header";
import ProfessionalForm from "@/components/ProfessionalForm";
import ProfessionalTable from "@/components/ProfessionalTable";
import { Professional, ThemeMode } from "@/lib/types";
import { exportToCsv } from "@/lib/csvExport";

const Home: FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('light');

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const handleExportCsv = (professionals: Professional[]) => {
    exportToCsv(professionals);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Header
        isFormVisible={isFormVisible}
        theme={theme}
        onToggleForm={toggleForm}
        onToggleTheme={toggleTheme}
        onExportCsv={() => handleExportCsv([])} // This will be filled by ProfessionalTable
      />
      
      <main className="container mx-auto p-6 space-y-6">
        <ProfessionalForm isVisible={isFormVisible} />
        <ProfessionalTable onExportData={handleExportCsv} />
      </main>
    </div>
  );
};

export default Home;
