import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10">
                    <BookOpen className="size-8 text-white" />
                </div>

                <div>
                <h1 className="text-4xl font-bold text-white">
                    Library Management System
                </h1>

                <p className="mt-2 text-slate-400">
                    Frontend setup is working successfully.
                </p>
                </div>

                <Button>Get Started</Button>
            </div>
        </div>
    );
}

export default App;