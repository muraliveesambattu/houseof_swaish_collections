import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "My Profile" };

export default async function AccountPage() {
  const session = await auth();
  if (!session) return null;

  const user = await prisma.user
    .findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true, birthday: true, createdAt: true },
    })
    .catch(() => null);

  return (
    <div>
      <h2 className="font-heading text-2xl text-[#2C2C2A] mb-6">My Profile</h2>

      <div className="bg-white rounded-sm border border-gray-100 p-6 space-y-4">
        <div>
          <p className="text-xs font-body text-gray-400 mb-1 uppercase tracking-wide">Name</p>
          <p className="font-body text-[#2C2C2A]">{user?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-body text-gray-400 mb-1 uppercase tracking-wide">Email</p>
          <p className="font-body text-[#2C2C2A]">{user?.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-body text-gray-400 mb-1 uppercase tracking-wide">Phone</p>
          <p className="font-body text-[#2C2C2A]">{user?.phone ?? "Not set"}</p>
        </div>
        {user?.birthday && (
          <div>
            <p className="text-xs font-body text-gray-400 mb-1 uppercase tracking-wide">Birthday</p>
            <p className="font-body text-[#2C2C2A]">{formatDate(user.birthday)}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-body text-gray-400 mb-1 uppercase tracking-wide">Member Since</p>
          <p className="font-body text-[#2C2C2A]">
            {user?.createdAt ? formatDate(user.createdAt) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
