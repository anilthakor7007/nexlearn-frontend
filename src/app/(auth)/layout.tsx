export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Branding/Image */}
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 text-white p-10">
                <div className="flex items-center gap-2 font-bold text-2xl">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        N
                    </div>
                    NexLearn
                </div>

                <div className="max-w-md">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        &ldquo;NexLearn has transformed how we deliver training. The AI-powered recommendations and progress tracking have increased our completion rates by 40%.&rdquo;
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
                        <div>
                            <div className="font-semibold">Anil Thakor</div>
                            <div className="text-sm text-zinc-400">CEO of NexLearn</div>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-zinc-500">
                    &copy; 2026 NexLearn Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
