import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { TopBar } from "@/components/ui/TopBar";
import { NewPostForm } from "@/components/ui/NewPostForm";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "COACH" && session.role !== "ADMIN") redirect("/feed");

  return (
    <div>
      <TopBar title="منشور جديد" backHref="/feed" />
      <NewPostForm />
    </div>
  );
}
