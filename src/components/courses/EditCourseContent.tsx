"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CourseForm, CourseFormValues } from "@/components/courses/CourseForm";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { ModuleList } from "@/components/modules/ModuleList";

interface Course {
    _id: string;
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    category: string;
    level: string;
    price: number;
    discountPrice?: number;
    language: string;
    status: "draft" | "published" | "archived";
    enrollmentCount: number;
    modules: Module[];
}

interface Module {
    _id: string;
    title: string;
    description?: string;
    order: number;
    lessons: unknown[];
    duration: number;
    isPublished: boolean;
}

export function EditCourseContent({ courseId }: { courseId: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const fetchCourse = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/courses/${courseId}`);
            setCourse(response.data.data.course);
        } catch (error) {
            console.error("Error fetching course:", error);
            toast({
                title: "Error",
                description: "Failed to fetch course details",
                variant: "destructive",
            });
            router.push("/dashboard/instructor/courses");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const handleSubmit = async (values: CourseFormValues) => {
        try {
            setIsSaving(true);
            const response = await api.put<{ data: { course: Course } }>(`/courses/${courseId}`, values);
            setCourse(response.data.data.course);
            toast({
                title: "Success",
                description: "Course updated successfully",
            });
        } catch (error) {
            console.error("Error updating course:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to update course",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleThumbnailUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("thumbnail", file);

            const response = await api.put<{ data: { course: Course } }>(`/courses/${courseId}/thumbnail`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setCourse((prev) => ({
                ...prev!,
                thumbnail: response.data.data.course.thumbnail,
            }));

            toast({
                title: "Success",
                description: "Thumbnail uploaded successfully",
            });
        } catch (error) {
            console.error("Error uploading thumbnail:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to upload thumbnail",
                variant: "destructive",
            });
            throw error;
        }
    };

    const handlePublishToggle = async () => {
        if (!course) return;

        try {
            setIsPublishing(true);
            if (course.status === "published") {
                toast({
                    title: "Info",
                    description: "Course is already published.",
                });
                return;

            } else {
                await api.patch(`/courses/${courseId}/publish`);
                setCourse((prev) => ({ ...prev!, status: "published" }));
                toast({
                    title: "Success",
                    description: "Course published successfully",
                });
            }
        } catch (error) {
            console.error("Error publishing course:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to publish course",
                variant: "destructive",
            });
        } finally {
            setIsPublishing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                            variant={
                                course.status === "published"
                                    ? "default"
                                    : course.status === "draft"
                                        ? "secondary"
                                        : "destructive"
                            }
                        >
                            {course.status}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    {course.status !== 'published' && (
                        <Button
                            onClick={handlePublishToggle}
                            disabled={isPublishing}
                            variant="default"
                        >
                            {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Publish Course
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList>
                    <TabsTrigger value="details">Course Details</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CourseForm
                                initialData={course}
                                onSubmit={handleSubmit}
                                isLoading={isSaving}
                                isEdit={true}
                                onThumbnailUpload={handleThumbnailUpload}
                                thumbnailUrl={course.thumbnail}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="curriculum">
                    <ModuleList
                        courseId={courseId}
                        modules={course.modules || []}
                        onModulesChange={fetchCourse}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
