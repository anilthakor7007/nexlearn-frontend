"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

const courseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(50, "Description must be at least 50 characters"),
    shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
    category: z.string().min(1, "Please select a category"),
    level: z.string().min(1, "Please select a level"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    discountPrice: z.coerce.number().min(0, "Discount price must be a positive number").optional(),
    language: z.string().default("English"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
    initialData?: Partial<CourseFormValues> & { thumbnail?: string };
    onSubmit: (data: CourseFormValues) => void;
    isLoading?: boolean;
    isEdit?: boolean;
    onThumbnailUpload?: (file: File) => Promise<void>;
    thumbnailUrl?: string;
}

export function CourseForm({
    initialData,
    onSubmit,
    isLoading,
    isEdit,
    onThumbnailUpload,
    thumbnailUrl,
}: CourseFormProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        thumbnailUrl || initialData?.thumbnail || null
    );

    const form = useForm<CourseFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(courseSchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            shortDescription: initialData?.shortDescription || "",
            category: initialData?.category || "",
            level: initialData?.level || "",
            price: initialData?.price || 0,
            discountPrice: initialData?.discountPrice || 0,
            language: initialData?.language || "English",
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onThumbnailUpload) {
            try {
                setIsUploading(true);
                // Create local preview
                const objectUrl = URL.createObjectURL(file);
                setPreviewUrl(objectUrl);

                await onThumbnailUpload(file);
            } catch (error) {
                console.error("Error uploading thumbnail:", error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Advanced Web Development" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="shortDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief overview of the course"
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detailed description of the course content"
                                            className="h-32"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Web Development">Web Development</SelectItem>
                                                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                                                <SelectItem value="Data Science">Data Science</SelectItem>
                                                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                                <SelectItem value="Design">Design</SelectItem>
                                                <SelectItem value="Business">Business</SelectItem>
                                                <SelectItem value="Marketing">Marketing</SelectItem>
                                                <SelectItem value="Photography">Photography</SelectItem>
                                                <SelectItem value="Music">Music</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Price ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="0.01" {...field} />
                                        </FormControl>
                                        <FormDescription>Optional</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Language</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Spanish">Spanish</SelectItem>
                                            <SelectItem value="French">French</SelectItem>
                                            <SelectItem value="German">German</SelectItem>
                                            <SelectItem value="Hindi">Hindi</SelectItem>
                                            <SelectItem value="Chinese">Chinese</SelectItem>
                                            <SelectItem value="Japanese">Japanese</SelectItem>
                                            <SelectItem value="Portuguese">Portuguese</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Course Thumbnail</FormLabel>
                            <div className="flex items-center gap-4">
                                <div className="relative w-40 h-24 bg-muted rounded-md overflow-hidden border">
                                    {previewUrl ? (
                                        <Image
                                            src={previewUrl}
                                            alt="Thumbnail preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={isUploading || !isEdit} // Only allow upload in edit mode or if handled separately
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Recommended size: 1280x720 (16:9)
                                    </p>
                                    {!isEdit && (
                                        <p className="text-xs text-amber-600 mt-1">
                                            Create course first to upload thumbnail
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEdit ? "Update Course" : "Create Course"}
                </Button>
            </form>
        </Form>
    );
}
