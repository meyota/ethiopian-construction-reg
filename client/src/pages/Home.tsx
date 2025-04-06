import { FC, useState, useRef } from "react";
import Header from "@/components/Header";
import ProfessionalForm from "@/components/ProfessionalForm";
import ProfessionalTable from "@/components/ProfessionalTable";
import { Professional, ThemeMode } from "@/lib/types";
import { exportToCsv } from "@/lib/csvExport";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const Home: FC = () => {
  const { user } = useAuth();
  const isStaff = user?.isStaff || false;
  const { toast } = useToast();
  
  // Only show form by default for staff users
  const [isFormVisible, setIsFormVisible] = useState(isStaff);
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  // Edit modal state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [professionalToEdit, setProfessionalToEdit] = useState<Professional | null>(null);
  
  // Form refs for edit dialog
  const trackingNumberRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const dateOfRegistrationRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const professionalTitleRef = useRef<HTMLInputElement>(null);
  const professionalNumberRef = useRef<HTMLInputElement>(null);
  const sectorRef = useRef<HTMLSelectElement>(null);
  const serviceTypeRef = useRef<HTMLSelectElement>(null);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const handleExportCsv = (professionals: Professional[]) => {
    if (professionals && professionals.length > 0) {
      const result = exportToCsv(professionals);
      if (result) {
        toast({
          title: "Export Successful",
          description: `Exported ${professionals.length} professionals to CSV.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Export Failed",
          description: "Failed to generate CSV file. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Export Failed",
        description: "No data available to export.",
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = (professional: Professional) => {
    setProfessionalToEdit(professional);
    setEditDialogOpen(true);
  };
  
  const updateProfessionalMutation = useMutation({
    mutationFn: async (updatedProfessional: Partial<Professional>) => {
      if (!professionalToEdit) return null;
      
      const response = await apiRequest(
        "PATCH", 
        `/api/professionals/${professionalToEdit.id}`, 
        updatedProfessional
      );
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Professional Updated",
        description: "The professional has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
      setEditDialogOpen(false);
      setProfessionalToEdit(null);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Failed to update professional: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });
  
  const handleSaveEdit = () => {
    if (!professionalToEdit) return;
    
    const updatedProfessional = {
      trackingNumber: trackingNumberRef.current?.value || professionalToEdit.trackingNumber,
      fullName: fullNameRef.current?.value || professionalToEdit.fullName,
      gender: genderRef.current?.value || professionalToEdit.gender,
      dateOfRegistration: dateOfRegistrationRef.current?.value || professionalToEdit.dateOfRegistration,
      phoneNumber: phoneNumberRef.current?.value || professionalToEdit.phoneNumber,
      professionalTitle: professionalTitleRef.current?.value || professionalToEdit.professionalTitle,
      professionalNumber: professionalNumberRef.current?.value || professionalToEdit.professionalNumber,
      sector: sectorRef.current?.value || professionalToEdit.sector,
      serviceType: serviceTypeRef.current?.value || professionalToEdit.serviceType
    };
    
    updateProfessionalMutation.mutate(updatedProfessional);
  };

  // State to track professionals data and successful data loading
  const [professionalsToExport, setProfessionalsToExport] = useState<Professional[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const handleProfessionalsData = (data: Professional[]) => {
    if (data && data.length > 0) {
      setProfessionalsToExport(data);
      setDataLoaded(true);
      console.log("Loaded", data.length, "professionals for potential export");
    }
  };
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Header
        isFormVisible={isFormVisible}
        theme={theme}
        onToggleForm={toggleForm}
        onToggleTheme={toggleTheme}
        onExportCsv={() => {
          if (dataLoaded && professionalsToExport.length > 0) {
            handleExportCsv(professionalsToExport);
          } else {
            toast({
              title: "Export Failed",
              description: "No data available to export. Please wait for data to load or add some professionals.",
              variant: "destructive",
            });
          }
        }}
      />
      
      <main className="container mx-auto p-6 space-y-6">
        {/* Only staff users can see and use the form */}
        {isStaff && <ProfessionalForm isVisible={isFormVisible} />}
        
        <ProfessionalTable onExportData={handleProfessionalsData} onEdit={handleEdit} />
        
        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Professional</DialogTitle>
              <DialogDescription>
                Update the professional's information.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="trackingNumber" className="text-right">Tracking Number:</label>
                <Input 
                  id="trackingNumber" 
                  defaultValue={professionalToEdit?.trackingNumber} 
                  className="col-span-3"
                  ref={trackingNumberRef}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fullName" className="text-right">Full Name:</label>
                <Input 
                  id="fullName" 
                  defaultValue={professionalToEdit?.fullName} 
                  className="col-span-3"
                  ref={fullNameRef}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="gender" className="text-right">Gender:</label>
                <Select defaultValue={professionalToEdit?.gender}>
                  <SelectTrigger className="col-span-3" id="gender" ref={genderRef as any}>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dateOfRegistration" className="text-right">Registration Date:</label>
                <Input 
                  id="dateOfRegistration" 
                  type="date" 
                  defaultValue={professionalToEdit?.dateOfRegistration} 
                  className="col-span-3"
                  ref={dateOfRegistrationRef}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phoneNumber" className="text-right">Phone Number:</label>
                <Input 
                  id="phoneNumber" 
                  defaultValue={professionalToEdit?.phoneNumber} 
                  className="col-span-3"
                  ref={phoneNumberRef}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="professionalTitle" className="text-right">Professional Title:</label>
                <Input 
                  id="professionalTitle" 
                  defaultValue={professionalToEdit?.professionalTitle} 
                  className="col-span-3"
                  ref={professionalTitleRef}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="professionalNumber" className="text-right">Professional Number:</label>
                <Input 
                  id="professionalNumber" 
                  defaultValue={professionalToEdit?.professionalNumber} 
                  className="col-span-3"
                  ref={professionalNumberRef}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="sector" className="text-right">Sector:</label>
                <Select defaultValue={professionalToEdit?.sector}>
                  <SelectTrigger className="col-span-3" id="sector" ref={sectorRef as any}>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="serviceType" className="text-right">Service Type:</label>
                <Select defaultValue={professionalToEdit?.serviceType}>
                  <SelectTrigger className="col-span-3" id="serviceType" ref={serviceTypeRef as any}>
                    <SelectValue placeholder="Select Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Renewal">Renewal</SelectItem>
                    <SelectItem value="Upgrade">Upgrade</SelectItem>
                    <SelectItem value="Practicing">Practicing</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Replacement">Replacement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSaveEdit}
                disabled={updateProfessionalMutation.isPending}
              >
                {updateProfessionalMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Home;
