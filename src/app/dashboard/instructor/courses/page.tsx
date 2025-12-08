"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { AxiosError } from "axios";
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
import { Pencil } from "lucide-react";

interface Course {
    id: string;
    title: string;
    shortDescription: string;
    thumbnail: string;
    status: "draft" | "published" | "archived";
    price: number;
    enrollmentCount: number;
    rating: number;
}

export default function InstructorCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/courses/my-courses");
            setCourses(response.data.data.courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast({
                title: "Error",
                description: "Failed to fetch courses",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/courses/${id}`);
            toast({
                title: "Success",
                description: "Course deleted successfully",
            });
            fetchCourses();
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast({
                title: "Error",
                description: axiosError.response?.data?.message || "Failed to delete course",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                    <p className="text-muted-foreground">
                        Manage your courses and track their performance
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/instructor/courses/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Course
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/10">
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p className="text-muted-foreground mb-4">
                        Start by creating your first course
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/instructor/courses/create">
                            Create Course
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <Card key={course.id} className="flex flex-col">
                            <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                                {course.thumbnail && (
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                )}
                                <div className="absolute top-2 right-2">
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
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {course.shortDescription}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>${course.price}</span>
                                    <span>{course.enrollmentCount} students</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link href={`/dashboard/instructor/courses/${course.id}`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="flex-1">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the
                                                course and remove all data associated with it.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(course.id)}>
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
