"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { LessonDialog } from "./LessonDialog";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

interface Lesson {
    _id: string;
    title: string;
    description?: string;
    type: "video" | "text" | "quiz" | "assignment";
    order: number;
    content: {
        videoUrl?: string;
        videoDuration?: number;
        textContent?: string;
    };
    isPreview: boolean;
    isPublished: boolean;
}

interface LessonListProps {
    moduleId: string;
    onLessonsChange: () => void;
}

export function LessonList({ moduleId, onLessonsChange }: LessonListProps) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const { toast } = useToast();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchLessons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moduleId]);

    const fetchLessons = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/modules/${moduleId}/lessons`);
            setLessons(response.data.data.lessons || []);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = lessons.findIndex((l) => l._id === active.id);
            const newIndex = lessons.findIndex((l) => l._id === over.id);

            const newLessons = arrayMove(lessons, oldIndex, newIndex);
            setLessons(newLessons);

            // Update order on backend
            try {
                const lessonOrders = newLessons.map((lesson, index) => ({
                    lessonId: lesson._id,
                    order: index + 1,
                }));

                await api.patch(`/modules/${moduleId}/lessons/reorder`, { lessonOrders });
                toast({
                    title: "Success",
                    description: "Lessons reordered successfully",
                });
                onLessonsChange();
            } catch (error) {
                console.error("Error reordering lessons:", error);
                const axiosError = error as AxiosError<{ message: string }>;
                toast({
                    title: "Error",
                    description: axiosError.response?.data?.message || "Failed to reorder lessons",
                    variant: "destructive",
                });
                // Revert on error
                fetchLessons();
            }
        }
    };

    const handleCreateLesson = () => {
        setEditingLesson(null);
        setIsDialogOpen(true);
    };

    const handleEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setIsDialogOpen(true);
    };

    const handleDeleteLesson = async (lessonId: string) => {
        try {
            await api.delete(`/lessons/${lessonId}`);
            toast({
                title: "Success",
                description: "Lesson deleted successfully",
            });
            fetchLessons();
            onLessonsChange();
        } catch (error) {
            console.error("Error deleting lesson:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to delete lesson",
                variant: "destructive",
            });
        }
    };

    const handleTogglePublish = async (lessonId: string) => {
        try {
            await api.patch(`/lessons/${lessonId}/publish`);
            toast({
                title: "Success",
                description: "Lesson publish status updated",
            });
            fetchLessons();
            onLessonsChange();
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

    const handleSuccess = () => {
        fetchLessons();
        onLessonsChange();
    };

    if (isLoading) {
        return <div className="text-sm text-muted-foreground">Loading lessons...</div>;
    }

    return (
        <div className="space-y-2 pl-8">
            {lessons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">No lessons yet</p>
                    <Button onClick={handleCreateLesson} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Lesson
                    </Button>
                </div>
            ) : (
                <>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={lessons.map((l) => l._id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1">
                                {lessons.map((lesson) => (
                                    <LessonItem
                                        key={lesson._id}
                                        lesson={lesson}
                                        onEdit={() => handleEditLesson(lesson)}
                                        onDelete={() => handleDeleteLesson(lesson._id)}
                                        onTogglePublish={() => handleTogglePublish(lesson._id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                    <Button onClick={handleCreateLesson} variant="outline" size="sm" className="w-full mt-2">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lesson
                    </Button>
                </>
            )}

            <LessonDialog
                moduleId={moduleId}
                lesson={editingLesson}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
