import { EditCourseContent } from "@/components/courses/EditCourseContent";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    return <EditCourseContent courseId={resolvedParams.id} />;
}
