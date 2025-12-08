"use client";

import { useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useState } from "react";

const moduleSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    order: z.coerce.number().min(1, "Order must be at least 1"),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

interface Module {
    _id: string;
    title: string;
    description?: string;
    order: number;
}

interface ModuleDialogProps {
    courseId: string;
    module?: Module | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ModuleDialog({ courseId, module, open, onOpenChange, onSuccess }: ModuleDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<ModuleFormValues>({
        resolver: zodResolver(moduleSchema) as Resolver<ModuleFormValues>,
        defaultValues: {
            title: "",
            description: "",
            order: 1,
        },
    });

    useEffect(() => {
        if (module) {
            form.reset({
                title: module.title,
                description: module.description || "",
                order: module.order,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                order: 1,
            });
        }
    }, [module, form]);

    const onSubmit = async (values: ModuleFormValues) => {
        try {
            setIsLoading(true);
            if (module) {
                // Update existing module - only send title and description to avoid order conflicts
                const updatePayload = {
                    title: values.title,
                    description: values.description,
                };
                await api.put(`/modules/${module._id}`, updatePayload);
                toast({
                    title: "Success",
                    description: "Module updated successfully",
                });
            } else {
                // Create new module - backend auto-calculates order
                const createPayload = {
                    title: values.title,
                    description: values.description,
                };
                await api.post(`/courses/${courseId}/modules`, createPayload);
                toast({
                    title: "Success",
                    description: "Module created successfully",
                });
            }
            onSuccess();
            onOpenChange(false);
            form.reset();
        } catch (error) {
            console.error("Error saving module:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to save module",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{module ? "Edit Module" : "Create Module"}</DialogTitle>
                    <DialogDescription>
                        {module
                            ? "Update the module details below."
                            : "Add a new module to organize your course content."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Introduction to React" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of this module"
                                            className="h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {module ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
