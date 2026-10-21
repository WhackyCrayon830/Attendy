"use server";

export async function logout() {
  const { signOut } = await import("@/auth");
  await signOut({ redirectTo: "/" });
}
