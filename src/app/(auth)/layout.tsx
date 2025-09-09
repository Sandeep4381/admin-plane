import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center">
            <Image 
                src="https://picsum.photos/1920/1080"
                alt="Background"
                fill
                className="object-cover opacity-30"
                data-ai-hint="abstract background"
            />
            <div className="z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
