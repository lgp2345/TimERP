import { LogOut, UserCircle2 } from "lucide-react";

type HeaderUserProfileProps = {
  userName: string;
};

/**
 * Renders user profile trigger and menu in header.
 */
export function HeaderUserProfile({ userName }: HeaderUserProfileProps) {
  return (
    <details className="relative">
      <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-md border px-2.5 text-xs transition-colors duration-200 hover:bg-accent">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-primary/15">
          <UserCircle2 className="h-4 w-4" />
        </span>
        <span className="max-w-20 truncate text-sm">{userName}</span>
      </summary>
      <div className="absolute right-0 z-20 mt-1.5 w-36 rounded-md border bg-popover p-1 shadow-sm">
        <button
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors duration-200 hover:bg-accent"
          type="button"
        >
          <UserCircle2 className="h-3.5 w-3.5" />
          个人中心
        </button>
        <button
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors duration-200 hover:bg-accent"
          type="button"
        >
          <LogOut className="h-3.5 w-3.5" />
          退出登录
        </button>
      </div>
    </details>
  );
}
