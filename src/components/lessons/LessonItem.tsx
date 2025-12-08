"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { GripVertical, Edit, Trash2, Video, FileText, HelpCircle, Eye } from "lucide-react";

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

interface LessonItemProps {
    lesson: Lesson;
    onEdit: () => void;
    onDelete: () => void;
    onTogglePublish: () => void;
}

export function LessonItem({ lesson, onEdit, onDelete, onTogglePublish }: LessonItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getTypeIcon = () => {
        switch (lesson.type) {
            case "video":
                return <Video className="h-4 w-4" />;
            case "text":
                return <FileText className="h-4 w-4" />;
            case "quiz":
            case "assignment":
                return <HelpCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return null;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md hover:bg-muted">
            <button
                className="cursor-grab active:cursor-grabbing touch-none"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-2 text-muted-foreground">
                {getTypeIcon()}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{lesson.title}</span>
                    {lesson.isPreview && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Preview
                        </Badge>
                    )}
                    {lesson.isPublished && (
                        <Badge variant="default" className="text-xs">
                            Published
                        </Badge>
                    )}
                </div>
                {lesson.content.videoDuration && (
                    <span className="text-xs text-muted-foreground">
                        {formatDuration(lesson.content.videoDuration)}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={onTogglePublish} className="h-8 px-2">
                    <span className="text-xs">{lesson.isPublished ? "Unpublish" : "Publish"}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                    <Edit className="h-3 w-3" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the lesson and all its content.
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
    );
}
