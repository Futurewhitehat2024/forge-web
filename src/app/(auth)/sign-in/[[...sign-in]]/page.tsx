import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <SignIn
        appearance={{
          variables: {
            colorBackground: "hsl(240 6% 4%)",
            colorInput: "hsl(240 4% 12%)",
            colorInputForeground: "hsl(0 0% 95%)",
            colorForeground: "hsl(0 0% 95%)",
            colorMutedForeground: "hsl(240 5% 55%)",
            colorPrimary: "hsl(217 91% 60%)",
            borderRadius: "0.625rem",
          },
          elements: {
            card: "bg-card border border-border shadow-xl",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: "border-border bg-secondary text-foreground",
            formButtonPrimary: "bg-primary text-primary-foreground",
            footerActionLink: "text-primary",
          },
        }}
      />
    </div>
  );
}