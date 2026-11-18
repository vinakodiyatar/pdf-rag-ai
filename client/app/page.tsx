import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";

export default function Home() {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Left side: Upload & PDF Preview */}
      <div className="w-[48vw] h-screen p-4 border-r border-zinc-800 flex flex-col">
        <FileUploadComponent />
      </div>

      {/* Right side: Chat */}
      <div className="w-[52vw] h-screen flex flex-col">
        <ChatComponent />
      </div>
    </div>
  );
}
