import UserList from "./UserList";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r">
        <UserList />
      </aside>

      <main className="flex-1">
        <ChatWindow />
      </main>
    </div>
  );
}
