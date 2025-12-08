"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GripVertical, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { LessonList } from "../lessons/LessonList";

interface Module {
    _id: string;
    title: string;
    description?: string;
    order: number;
    lessons?: unknown[];
    duration: number;
    isPublished: boolean;
}

interface ModuleItemProps {
    module: Module;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePublish: () => void;
    onLessonsChange: () => void;
}

export function ModuleItem({ module, onEdit, onDelete, onTogglePublish, onLessonsChange }: ModuleItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card>
                <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                        <button
                            className="cursor-grab active:cursor-grabbing touch-none"
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-0 h-auto"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>

                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{module.title}</h3>
                                {module.isPublished && (
                                    <Badge variant="default" className="text-xs">
                                        Published
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {(module.lessons?.length || 0)} lesson{(module.lessons?.length || 0) !== 1 ? "s" : ""}
                                {module.duration > 0 && ` • ${formatDuration(module.duration)}`}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={onTogglePublish}>
                                {module.isPublished ? "Unpublish" : "Publish"}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={onEdit}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Module?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete the module. You must delete all lessons first.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent className="pt-0 pb-4 px-4">
                        {module.description && (
                            <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                        )}
                        <LessonList
                            moduleId={module._id}
                            onLessonsChange={onLessonsChange}
                        />
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
