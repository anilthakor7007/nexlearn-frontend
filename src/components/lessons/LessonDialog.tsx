"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { RichTextEditor } from "../common/RichTextEditor";

const lessonSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    type: z.enum(["video", "text", "quiz", "assignment"]),
    order: z.coerce.number().min(1, "Order must be at least 1"),
    videoUrl: z.string().optional(),
    videoDuration: z.coerce.number().optional(),
    textContent: z.string().optional(),
    isPreview: z.boolean().default(false),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

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
}

interface LessonDialogProps {
    moduleId: string;
    lesson?: Lesson | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function LessonDialog({ moduleId, lesson, open, onOpenChange, onSuccess }: LessonDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<LessonFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(lessonSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            type: "video",
            order: 1,
            videoUrl: "",
            videoDuration: 0,
            textContent: "",
            isPreview: false,
        },
    });

    const selectedType = form.watch("type");

    useEffect(() => {
        if (lesson) {
            form.reset({
                title: lesson.title,
                description: lesson.description || "",
                type: lesson.type,
                order: lesson.order,
                videoUrl: lesson.content.videoUrl || "",
                videoDuration: lesson.content.videoDuration || 0,
                textContent: lesson.content.textContent || "",
                isPreview: lesson.isPreview,
            });
        } else {
            form.reset({
                title: "",
                description: "",
                type: "video",
                order: 1,
                videoUrl: "",
                videoDuration: 0,
                textContent: "",
                isPreview: false,
            });
        }
    }, [lesson, form]);

    const onSubmit = async (values: LessonFormValues) => {
        try {
            setIsLoading(true);

            // Prepare content based on lesson type
            const content: {
                videoUrl?: string;
                videoDuration?: number;
                textContent?: string;
            } = {};
            if (values.type === "video") {
                content.videoUrl = values.videoUrl;
                content.videoDuration = values.videoDuration || 0;
            } else if (values.type === "text") {
                content.textContent = values.textContent;
            }

            if (lesson) {
                // Update existing lesson - exclude order to avoid unique index conflicts
                const updatePayload = {
                    title: values.title,
                    description: values.description,
                    type: values.type,
                    content,
                    isPreview: values.isPreview,
                };
                await api.put(`/lessons/${lesson._id}`, updatePayload);
                toast({
                    title: "Success",
                    description: "Lesson updated successfully",
                });
            } else {
                // Create new lesson - backend auto-calculates order
                const createPayload = {
                    title: values.title,
                    description: values.description,
                    type: values.type,
                    content,
                    isPreview: values.isPreview,
                };
                await api.post(`/modules/${moduleId}/lessons`, createPayload);
                toast({
                    title: "Success",
                    description: "Lesson created successfully",
                });
            }
            onSuccess();
            onOpenChange(false);
            form.reset();
        } catch (error) {
            console.error("Error saving lesson:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to save lesson",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{lesson ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
                    <DialogDescription>
                        {lesson
                            ? "Update the lesson details below."
                            : "Add a new lesson to this module."}
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
                                        <Input placeholder="e.g. Introduction to Components" {...field} />
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
                                            placeholder="Brief description of this lesson"
                                            className="h-16"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lesson Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="video">Video</SelectItem>
                                                <SelectItem value="text">Text</SelectItem>
                                                <SelectItem value="quiz">Quiz (Coming Soon)</SelectItem>
                                                <SelectItem value="assignment">Assignment (Coming Soon)</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                        </div>

                        {/* Video-specific fields */}
                        {selectedType === "video" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="videoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Video URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                YouTube, Vimeo, or direct video URL
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="videoDuration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (seconds)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="0" placeholder="300" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Video duration in seconds (e.g., 300 for 5 minutes)
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Text-specific fields */}
                        {selectedType === "text" && (
                            <FormField
                                control={form.control}
                                name="textContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <RichTextEditor
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Quiz/Assignment placeholder */}
                        {(selectedType === "quiz" || selectedType === "assignment") && (
                            <div className="p-4 border rounded-md bg-muted">
                                <p className="text-sm text-muted-foreground">
                                    {selectedType === "quiz" ? "Quiz" : "Assignment"} functionality coming soon!
                                </p>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="isPreview"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Free Preview
                                        </FormLabel>
                                        <FormDescription>
                                            Allow non-enrolled users to preview this lesson
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {lesson ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
