import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2, FileSpreadsheetIcon } from "lucide-react";
import { Professional } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface ProfessionalTableProps {
  onExportData: (professionals: Professional[]) => void;
  onEdit?: (professional: Professional) => void;
}

const ProfessionalTable: FC<ProfessionalTableProps> = ({ onExportData, onEdit = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const isStaff = user?.isStaff || false;
  
  const { data: professionals = [], isLoading, isError } = useQuery<Professional[]>({
    queryKey: ['/api/professionals', searchTerm],
    queryFn: async ({ queryKey }) => {
      const [_, term] = queryKey;
      const url = term ? `/api/professionals?searchTerm=${encodeURIComponent(term as string)}` : "/api/professionals";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch professionals");
      return response.json();
    }
  });

  const deleteProfessionalMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/professionals/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Professional Deleted",
        description: "The professional has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete professional: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this professional?")) {
      deleteProfessionalMutation.mutate(id);
    }
  };

  // Provide the current data for export
  const handleExport = () => {
    if (professionals && professionals.length > 0) {
      onExportData(professionals);
      console.log("Exporting", professionals.length, "professionals to CSV");
    } else {
      toast({
        title: "Export Failed",
        description: "No data available to export.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="text-center py-8">Loading professionals data...</div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="text-center py-8 text-red-500">Error loading professionals data. Please try again.</div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      {/* Search Bar and Actions */}
      <div className="mb-6 flex justify-between">
        <div className="relative w-full mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search by Name or Phone"
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <Button 
          variant="default" 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleExport}
          disabled={professionals.length === 0}
        >
          <FileSpreadsheetIcon className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
      
      {/* Data Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-700">
            <TableRow>
              <TableHead>Roll No.</TableHead>
              <TableHead>Tracking Number</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Professional Title</TableHead>
              <TableHead>Professional Number</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Date of Registration</TableHead>
              {isStaff && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4">
                  No professionals found. Add some using the form above.
                </TableCell>
              </TableRow>
            ) : (
              professionals.map((professional, index) => (
                <TableRow key={professional.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{professional.trackingNumber}</TableCell>
                  <TableCell>{professional.fullName}</TableCell>
                  <TableCell>{professional.gender}</TableCell>
                  <TableCell>{professional.phoneNumber}</TableCell>
                  <TableCell>{professional.professionalTitle}</TableCell>
                  <TableCell>{professional.professionalNumber}</TableCell>
                  <TableCell>{professional.sector}</TableCell>
                  <TableCell>{professional.serviceType}</TableCell>
                  <TableCell>{professional.dateOfRegistration}</TableCell>
                  {isStaff && (
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => onEdit(professional)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(professional.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{professionals.length}</span> results
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled 
            className="border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled 
            className="border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalTable;
