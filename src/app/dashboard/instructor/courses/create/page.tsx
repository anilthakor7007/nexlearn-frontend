"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourseForm, CourseFormValues } from "@/components/courses/CourseForm";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";

interface CourseCreationResponse {
    data: {
        course: {
            id: string;
        };
    };
}

export default function CreateCoursePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: CourseFormValues) => {
        try {
            setIsLoading(true);
            const payload = {
                ...values,
                whatYouWillLearn: [],
                thumbnail: "", // Backend will handle default
            };
            const response = await api.post<CourseCreationResponse>("/courses", payload);
            toast({
                title: "Success",
                description: "Course created successfully",
            });
            // Redirect to edit page to add modules/upload thumbnail
            router.push(`/dashboard/instructor/courses/${response.data.data.course.id}`);
        } catch (error) {
            console.error("Error creating course:", error);
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to create course",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Course</CardTitle>
                </CardHeader>
                <CardContent>
                    <CourseForm onSubmit={handleSubmit} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
