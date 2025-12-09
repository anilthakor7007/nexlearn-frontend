"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ModuleItem } from "./ModuleItem";
import { ModuleDialog } from "./ModuleDialog";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

interface Module {
    id: string;
    title: string;
    description?: string;
    order: number;
    lessons: unknown[];
    duration: number;
    isPublished: boolean;
}

interface ModuleListProps {
    courseId: string;
    modules: Module[];
    onModulesChange: () => void;
}

export function ModuleList({ courseId, modules: initialModules, onModulesChange }: ModuleListProps) {
    const [modules, setModules] = useState<Module[]>(initialModules);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const { toast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = modules.findIndex((m) => m.id === active.id);
            const newIndex = modules.findIndex((m) => m.id === over.id);

            const newModules = arrayMove(modules, oldIndex, newIndex);
            setModules(newModules);

            // Update order on backend
            try {
                const moduleOrders = newModules.map((module, index) => ({
                    moduleId: module.id,
                    order: index + 1,
                }));

                await api.patch(`/courses/${courseId}/modules/reorder`, { moduleOrders });
                toast({
                    title: "Success",
                    description: "Modules reordered successfully",
                });
                onModulesChange();
            } catch (error) {
                console.error("Error reordering modules:", error);
                const axiosError = error as AxiosError<{ message: string }>;
                toast({
                    title: "Error",
                    description: axiosError.response?.data?.message || "Failed to reorder modules",
                    variant: "destructive",
                });
                // Revert on error
                setModules(initialModules);
            }
        }
    };

    const handleCreateModule = () => {
        setEditingModule(null);
        setIsDialogOpen(true);
    };

    const handleEditModule = (module: Module) => {
        setEditingModule(module);
        setIsDialogOpen(true);
    };

    const handleDeleteModule = async (moduleId: string) => {
        try {
            await api.delete(`/modules/${moduleId}`);
            toast({
                title: "Success",
                description: "Module deleted successfully",
            });
            onModulesChange();
        } catch (error) {
            console.error("Error deleting module:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to delete module",
                variant: "destructive",
            });
        }
    };

    const handleTogglePublish = async (moduleId: string) => {
        try {
            await api.patch(`/modules/${moduleId}/publish`);
            toast({
                title: "Success",
                description: "Module publish status updated",
            });
            onModulesChange();
        } catch (error) {
            console.error("Error toggling publish:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to update publish status",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Course Curriculum</h2>
                    <p className="text-muted-foreground">
                        {modules.length} module{modules.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button onClick={handleCreateModule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Module
                </Button>
            </div>

            {modules.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">No modules yet</p>
                        <Button onClick={handleCreateModule} variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Module
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {modules.map((module) => (
                                <ModuleItem
                                    key={module.id}
                                    module={module}
                                    onEdit={() => handleEditModule(module)}
                                    onDelete={() => handleDeleteModule(module.id)}
                                    onTogglePublish={() => handleTogglePublish(module.id)}
                                    onLessonsChange={onModulesChange}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <ModuleDialog
                courseId={courseId}
                module={editingModule}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={onModulesChange}
            />
        </div>
    );
}
