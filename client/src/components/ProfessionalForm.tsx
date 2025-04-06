import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ProfessionalFormData } from "@/lib/types";
import { queryClient } from "@/lib/queryClient";

const formSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
  fullName: z.string().min(1, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfRegistration: z.string().min(1, "Date of registration is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  professionalTitle: z.string().min(1, "Professional title is required"),
  professionalNumber: z.string().min(1, "Professional number is required"),
  sector: z.string().min(1, "Sector is required"),
  serviceType: z.string().min(1, "Service type is required"),
});

interface ProfessionalFormProps {
  isVisible: boolean;
}

const ProfessionalForm: FC<ProfessionalFormProps> = ({ isVisible }) => {
  const { toast } = useToast();
  
  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingNumber: "",
      fullName: "",
      gender: "",
      dateOfRegistration: "",
      phoneNumber: "",
      professionalTitle: "",
      professionalNumber: "",
      sector: "construction",
      serviceType: "New",
    },
  });

  const addProfessionalMutation = useMutation({
    mutationFn: async (data: ProfessionalFormData) => {
      const response = await apiRequest("POST", "/api/professionals", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Professional Added",
        description: "The professional has been successfully added.",
      });
      form.reset({
        trackingNumber: "",
        fullName: "",
        gender: "",
        dateOfRegistration: "",
        phoneNumber: "",
        professionalTitle: "",
        professionalNumber: "",
        sector: "construction",
        serviceType: "New",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/professionals'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add professional: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfessionalFormData) => {
    addProfessionalMutation.mutate(data);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4">Add New Professional</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="trackingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracking Number</FormLabel>
                <FormControl>
                  <Input placeholder="ECA-2023-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfRegistration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Registration</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="date" 
                      {...field} 
                      className="text-left pr-10" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+251912345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl>
                  <Input placeholder="Graduate Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="professionalNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Number</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sector</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Renewal">Renewal</SelectItem>
                    <SelectItem value="Upgrade">Upgrade</SelectItem>
                    <SelectItem value="Practicing">Practicing</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Replacement">Replacement</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4">
            <Button 
              type="submit" 
              className="bg-[#3498db] hover:bg-[#2980b9] text-white"
              disabled={addProfessionalMutation.isPending}
            >
              {addProfessionalMutation.isPending ? "Adding..." : "Add Record"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default ProfessionalForm;
